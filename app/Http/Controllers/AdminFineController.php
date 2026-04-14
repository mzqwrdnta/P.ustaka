<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminFineController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['member', 'book'])
            ->where('denda', '>', 0)
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
            $query->where('status_denda', $request->status);
        }

        $transactions = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Fines/Index', [
            'fines' => $transactions,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $request->validate([
            'bayar' => 'nullable|numeric|min:0',
            'status_denda' => 'nullable|string|in:lunas,belum_bayar',
        ]);

        if ($request->has('status_denda') && $request->status_denda === 'lunas') {
            $transaction->update([
                'denda_dibayar' => $transaction->denda,
                'status_denda' => 'lunas',
            ]);

            return back()->with('success', 'Denda berhasil dilunasi.');
        }

        if ($request->has('bayar')) {
            $newDibayar = $transaction->denda_dibayar + (int) $request->bayar;

            if ($newDibayar > $transaction->denda) {
                return back()->with('error', 'Jumlah bayar melebihi total denda.');
            }

            $transaction->update([
                'denda_dibayar' => $newDibayar,
                'status_denda' => ($newDibayar >= $transaction->denda) ? 'lunas' : 'belum_bayar',
            ]);

            return back()->with('success', 'Pembayaran denda berhasil dicatat.');
        }

        return back();
    }
}
