<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index()
    {
        $member = auth()->user()->member;
        
        $stats = [
            'available_books' => Book::where('status', 'aktif')->where('stok', '>', 0)->count(),
            'active_borrows' => Transaction::where('member_id', $member->id)
                ->whereIn('status', ['dipinjam', 'pending_pengembalian'])
                ->count(),
            'unpaid_fines' => Transaction::where('member_id', $member->id)
                ->where('status_denda', 'belum_bayar')
                ->sum('denda'),
        ];

        return Inertia::render('User/Dashboard', [
            'stats' => $stats
        ]);
    }
}
