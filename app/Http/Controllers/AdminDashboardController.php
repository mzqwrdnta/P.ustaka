<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Member;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_books' => Book::count(),
            'total_members' => Member::count(),
            'books_borrowed' => Transaction::where('status', 'dipinjam')->count(),
            'pending_borrows' => Transaction::where('status', 'pending_peminjaman')->count(),
            'pending_returns' => Transaction::where('status', 'pending_pengembalian')->count(),
            'unpaid_fines' => Transaction::where('status_denda', 'belum_bayar')->sum('denda'),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}
