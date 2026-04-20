<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Setting;
use App\Models\Transaction;
use App\Services\WhatsAppService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminTransactionController extends Controller
{
    public function __construct(protected WhatsAppService $whatsapp) {}

    public function borrows(Request $request)
    {
        Transaction::syncFines();

        $query = Transaction::with(['member.user', 'book'])
            ->where('status', '!=', 'dikembalikan')
            ->orderBy('created_at', 'desc');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('member', function ($m) use ($search) {
                    $m->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%");
                })->orWhereHas('book', function ($b) use ($search) {
                    $b->where('judul', 'like', "%{$search}%");
                });
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->kelas) {
            $query->whereHas('member', fn ($q) => $q->whereRaw("REPLACE(LOWER(kelas), '-', ' ') = ?", [strtolower($request->kelas)]));
        }

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('created_at', [$request->start_date, $request->end_date]);
        } elseif ($request->tanggal) {
            $query->whereDate('created_at', $request->tanggal);
        }

        $transactions = $query->paginate(10)->withQueryString();

        $kelasOptions = Member::getUniqueKelas();

        return Inertia::render('Admin/Transactions/Borrows', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status', 'kelas', 'tanggal', 'start_date', 'end_date']),
            'kelasOptions' => $kelasOptions,
        ]);
    }

    public function returns(Request $request)
    {
        Transaction::syncFines();

        $query = Transaction::with(['member.user', 'book'])
            ->whereIn('status', ['dikembalikan', 'pending_pengembalian'])
            ->orderByRaw("CASE WHEN status = 'pending_pengembalian' THEN 0 ELSE 1 END")
            ->orderBy('tanggal_kembali', 'desc')
            ->orderBy('created_at', 'desc');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('member', function ($m) use ($search) {
                    $m->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%");
                })->orWhereHas('book', function ($b) use ($search) {
                    $b->where('judul', 'like', "%{$search}%");
                });
            });
        }

        if ($request->kelas) {
            $query->whereHas('member', fn ($q) => $q->whereRaw("REPLACE(LOWER(kelas), '-', ' ') = ?", [strtolower($request->kelas)]));
        }

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('tanggal_kembali', [$request->start_date, $request->end_date]);
        } elseif ($request->tanggal) {
            $query->whereDate('tanggal_kembali', $request->tanggal);
        }

        $transactions = $query->paginate(10)->withQueryString();

        $kelasOptions = Member::getUniqueKelas();

        return Inertia::render('Admin/Transactions/Returns', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'kelas', 'tanggal', 'start_date', 'end_date']),
            'kelasOptions' => $kelasOptions,
        ]);
    }

    public function show(Transaction $transaction): JsonResponse
    {
        $transaction->load(['member.user', 'book']);

        return response()->json($transaction);
    }

    public function verifyBorrow(Transaction $transaction)
    {
        if ($transaction->status !== 'pending_peminjaman') {
            abort(403);
        }

        $maxDays = Setting::where('key', 'maksimal_hari_pinjam')->value('value') ?? 7;

        $transaction->update([
            'status' => 'dipinjam',
            'tanggal_pinjam' => now(),
            'tanggal_jatuh_tempo' => now()->addDays((int) $maxDays),
        ]);

        $transaction->book()->decrement('stok', 1);

        return back()->with('success', 'Peminjaman disetujui.');
    }

    public function rejectBorrow(Transaction $transaction)
    {
        if ($transaction->status !== 'pending_peminjaman') {
            abort(403);
        }

        $transaction->update([
            'status' => 'ditolak',
        ]);

        return back()->with('success', 'Peminjaman ditolak.');
    }

    public function verifyReturn(Transaction $transaction)
    {
        if ($transaction->status !== 'pending_pengembalian') {
            abort(403);
        }

        $returnDate = $transaction->tanggal_pengajuan_kembali ?: now();
        $jatuhTempo = Carbon::parse($transaction->tanggal_jatuh_tempo);

        $hariTerlambat = 0;
        $denda = 0;
        $statusDenda = 'belum_ada';

        if (Carbon::parse($returnDate)->startOfDay()->gt($jatuhTempo->startOfDay())) {
            $hariTerlambat = abs((int) Carbon::parse($returnDate)->startOfDay()->diffInDays($jatuhTempo->startOfDay(), false));
            $dendaPerHari = Setting::where('key', 'denda_per_hari')->value('value') ?? 2000;
            $denda = $hariTerlambat * (int) $dendaPerHari;

            $statusDenda = ($transaction->denda_dibayar >= $denda && $denda > 0) ? 'lunas' : 'belum_bayar';
        }

        $transaction->update([
            'status' => 'dikembalikan',
            'tanggal_kembali' => now(),
            'hari_terlambat' => $hariTerlambat,
            'denda' => $denda,
            'status_denda' => $statusDenda,
        ]);

        $transaction->book()->increment('stok', 1);

        return back()->with('success', 'Pengembalian diverifikasi.');
    }

    public function payFine(Transaction $transaction)
    {
        if ($transaction->status_denda !== 'belum_bayar') {
            abort(403);
        }

        $transaction->update([
            'denda_dibayar' => $transaction->denda,
            'status_denda' => 'lunas',
        ]);

        return back()->with('success', 'Denda berhasil dilunasi.');
    }

    public function sendReminder(Transaction $transaction)
    {
        $member = $transaction->member;
        if (! $member || ! $member->no_hp) {
            return back()->with('error', 'Nomor HP anggota tidak ditemukan.');
        }

        $message = "[Pengingat Perpustakaan]\n\nHalo {$member->nama_lengkap},\n\nWaktu peminjaman buku *{$transaction->book->judul}* sudah jatuh tempo.\nHarap segera mengembalikan buku ke perpustakaan.\n";

        if ($transaction->denda > 0) {
            $formattedDenda = 'Rp '.number_format($transaction->denda, 0, ',', '.');
            $message .= "Denda keterlambatan Anda saat ini: *{$formattedDenda}*\n";
        }

        $message .= "\nTerima kasih.";

        $sent = $this->whatsapp->sendMessage($member->no_hp, $message);

        if ($sent) {
            return back()->with('success', 'Pesan pengingat berhasil dikirim ke WhatsApp.');
        }

        return back()->with('error', 'Gagal mengirim pesan WhatsApp.');
    }
}
