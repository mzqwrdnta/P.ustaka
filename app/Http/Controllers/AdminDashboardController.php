<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Member;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        Transaction::syncFines();

        $year = $request->input('year', date('Y'));
        $month = $request->input('month', date('n'));

        $stats = [
            'total_books' => Book::count(),
            'total_members' => Member::count(),
            'books_borrowed' => Transaction::where('status', 'dipinjam')->count(),
            'pending_borrows' => Transaction::where('status', 'pending_peminjaman')->count(),
            'pending_returns' => Transaction::where('status', 'pending_pengembalian')->count(),
            'unpaid_fines' => Transaction::where('status_denda', 'belum_bayar')->sum('denda'),
        ];

        // Chart Transaksi (Trend - Daily in selected month/year)
        $transactionTrends = Transaction::selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'name' => Carbon::parse($item->date)->translatedFormat('d M'),
                'total' => $item->total,
            ]);

        // Fallback for empty data/trends display
        if ($transactionTrends->isEmpty()) {
            $transactionTrends = collect([
                ['name' => 'No Data', 'total' => 0],
            ]);
        }

        // Chart Anggota per Kelas (Bar Chart)
        $membersByClass = Member::selectRaw("REPLACE(kelas, '-', ' ') as kategori_kelas, COUNT(*) as total")
            ->groupBy('kategori_kelas')
            ->orderBy('kategori_kelas')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->kategori_kelas,
                'total' => $item->total,
            ]);

        // Chart Buku per Kategori (Bar Chart)
        $booksByCategory = Book::selectRaw('kategori, COUNT(*) as total')
            ->groupBy('kategori')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(fn ($item) => [
                'name' => $item->kategori ?: 'Tanpa Kategori',
                'total' => $item->total,
            ]);

        $months = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        $years = Transaction::selectRaw('YEAR(created_at) as year')
            ->distinct()
            ->orderByDesc('year')
            ->pluck('year')
            ->toArray();
        if (empty($years)) {
            $years = [date('Y')];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'charts' => [
                'transactions' => $transactionTrends,
                'members' => $membersByClass,
                'books' => $booksByCategory,
            ],
            'filters' => [
                'year' => (int) $year,
                'month' => (int) $month,
            ],
            'options' => [
                'months' => $months,
                'years' => $years,
            ],
        ]);
    }
}
