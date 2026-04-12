<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminTransactionController extends Controller
{
    public function borrows(Request $request)
    {
        $query = Transaction::with(['member.user', 'book'])
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

        if ($request->tanggal) {
            $query->whereDate('created_at', $request->tanggal);
        }

        $transactions = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Transactions/Borrows', [
            'transactions' => $transactions,
            'filters' => $request->only('search', 'tanggal')
        ]);
    }

    public function returns(Request $request)
    {
        $query = Transaction::with(['member.user', 'book'])
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

        if ($request->tanggal) {
            $query->whereDate('created_at', $request->tanggal);
        }

        $transactions = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Transactions/Returns', [
            'transactions' => $transactions,
            'filters' => $request->only('search', 'tanggal')
        ]);
    }

    public function show(Transaction $transaction): \Illuminate\Http\JsonResponse
    {
        $transaction->load(['member.user', 'book']);

        return response()->json($transaction);
    }

    public function verifyBorrow(Transaction $transaction)
    {
        if ($transaction->status !== 'pending_peminjaman') abort(403);

        $maxDays = Setting::where('key', 'maksimal_hari_pinjam')->value('value') ?? 7;

        $transaction->update([
            'status' => 'dipinjam',
            'tanggal_pinjam' => now(),
            'tanggal_jatuh_tempo' => now()->addDays((int)$maxDays)
        ]);

        $transaction->book()->decrement('stok', 1);

        return back()->with('success', 'Peminjaman disetujui.');
    }

    public function rejectBorrow(Transaction $transaction)
    {
        if ($transaction->status !== 'pending_peminjaman') abort(403);

        $transaction->update([
            'status' => 'ditolak',
        ]);

        return back()->with('success', 'Peminjaman ditolak.');
    }

    public function verifyReturn(Transaction $transaction)
    {
        if ($transaction->status !== 'pending_pengembalian') abort(403);

        $now = now();
        $jatuhTempo = Carbon::parse($transaction->tanggal_jatuh_tempo);
        
        $hariTerlambat = 0;
        $denda = 0;
        $statusDenda = 'belum_ada';

        if ($now->startOfDay()->gt($jatuhTempo->startOfDay())) {
            $hariTerlambat = $now->startOfDay()->diffInDays($jatuhTempo->startOfDay());
            $dendaPerHari = Setting::where('key', 'denda_per_hari')->value('value') ?? 2000;
            $denda = $hariTerlambat * (int)$dendaPerHari;
            $statusDenda = 'belum_bayar';
        }

        $transaction->update([
            'status' => 'dikembalikan',
            'tanggal_kembali' => $now,
            'hari_terlambat' => $hariTerlambat,
            'denda' => $denda,
            'status_denda' => $statusDenda,
        ]);

        $transaction->book()->increment('stok', 1);

        return back()->with('success', 'Pengembalian diverifikasi.');
    }

    public function payFine(Transaction $transaction)
    {
        if ($transaction->status_denda !== 'belum_bayar') abort(403);

        $transaction->update([
            'status_denda' => 'lunas'
        ]);

        return back()->with('success', 'Denda berhasil dilunasi.');
    }
}
