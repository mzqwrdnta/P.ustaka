<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserTransactionController extends Controller
{
    public function index(Request $request)
    {
        $member = auth()->user()->member;

        $query = Transaction::with('book')
            ->where('member_id', $member->id);

        if ($request->status && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('kode_transaksi', 'like', "%{$search}%")
                  ->orWhereHas('book', function($q2) use ($search) {
                      $q2->where('judul', 'like', "%{$search}%");
                  });
            });
        }

        $transactions = $query->orderBy('created_at', 'desc')
            ->paginate(10)->withQueryString();

        return Inertia::render('User/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['status', 'search'])
        ]);
    }

    public function returnBook(Transaction $transaction)
    {
        $member = auth()->user()->member;

        if ($transaction->member_id !== $member->id) {
            abort(403);
        }

        if ($transaction->status !== 'dipinjam') {
            return back()->with('error', 'Transaksi tidak dapat dikembalikan.');
        }

        $transaction->update([
            'status' => 'pending_pengembalian',
            'tanggal_pengajuan_kembali' => now(),
        ]);

        return back()->with('success', 'Pengajuan pengembalian berhasil dikirim.');
    }
}
