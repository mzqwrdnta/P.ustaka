<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserBookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query()->where('status', 'aktif');

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('judul', 'like', "%{$request->search}%")
                  ->orWhere('penulis', 'like', "%{$request->search}%")
                  ->orWhere('kategori', 'like', "%{$request->search}%");
            });
        }

        if ($request->availability === 'tersedia') {
            $query->where('stok', '>', 0);
        } elseif ($request->availability === 'habis') {
            $query->where('stok', '<=', 0);
        }

        if ($request->kategori && $request->kategori !== '') {
            $query->where('kategori', $request->kategori);
        }

        $categories = Book::where('status', 'aktif')->pluck('kategori')->unique()->values();

        $books = $query->orderByRaw('stok > 0 DESC')->latest()->paginate(12)->withQueryString();

        return Inertia::render('User/Books/Index', [
            'books' => $books,
            'categories' => $categories,
            'filters' => $request->only(['search', 'availability', 'kategori'])
        ]);
    }

    public function borrow(Book $book)
    {
        $member = auth()->user()->member;

        if ($book->status !== 'aktif' || $book->stok <= 0) {
            return back()->with('error', 'Buku tidak tersedia untuk dipinjam.');
        }

        // Avoid double requesting same book
        $existing = \App\Models\Transaction::where('member_id', $member->id)
            ->where('book_id', $book->id)
            ->whereIn('status', ['pending_peminjaman', 'dipinjam'])
            ->exists();

        if ($existing) {
            return back()->with('error', 'Anda sudah meminjam atau sedang mengajukan buku ini.');
        }

        \App\Models\Transaction::create([
            'kode_transaksi' => 'TRX-' . time() . '-' . auth()->id(),
            'member_id' => $member->id,
            'book_id' => $book->id,
            'status' => 'pending_peminjaman',
            'status_denda' => 'belum_ada',
            'denda' => 0,
        ]);

        return redirect()->route('user.transactions.index')->with('success', 'Berhasil mengajukan peminjaman buku.');
    }
}
