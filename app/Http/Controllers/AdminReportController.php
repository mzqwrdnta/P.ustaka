<?php

namespace App\Http\Controllers;

use App\Exports\TransactionsExport;
use App\Models\Member;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class AdminReportController extends Controller
{
    private function applyFilters($query, Request $request)
    {
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('member', fn ($m) => $m->where('nama_lengkap', 'like', "%$search%"))
                    ->orWhereHas('book', fn ($b) => $b->where('judul', 'like', "%$search%"));
            });
        }

        if ($request->status) {
            if ($request->status === 'terlambat') {
                $query->where('denda', '>', 0);
            } else {
                $query->where('status', $request->status);
            }
        }

        if ($request->kelas) {
            $query->whereHas('member', fn ($q) => $q->whereRaw("REPLACE(LOWER(kelas), '-', ' ') = ?", [strtolower($request->kelas)]));
        }

        if ($request->period_type) {
            if ($request->period_type === 'harian' && $request->period_date) {
                $query->whereDate('tanggal_pinjam', $request->period_date);
            } elseif ($request->period_type === 'bulanan' && $request->period_month) {
                $month = date('m', strtotime($request->period_month));
                $year = date('Y', strtotime($request->period_month));
                $query->whereMonth('tanggal_pinjam', $month)
                    ->whereYear('tanggal_pinjam', $year);
            } elseif ($request->period_type === 'tahunan' && $request->period_year) {
                $query->whereYear('tanggal_pinjam', $request->period_year);
            }
        } elseif ($request->start_date && $request->end_date) {
            $query->whereBetween('tanggal_pinjam', [
                $request->start_date,
                $request->end_date,
            ]);
        }

        return $query;
    }

    public function index(Request $request)
    {
        $query = Transaction::with(['member', 'book']);
        $query = $this->applyFilters($query, $request);

        $transactions = $query->latest()->paginate(10)->withQueryString();

        // stats
        $totalPinjam = clone $query;
        $totalPinjam = $totalPinjam->count();

        $totalTelat = clone $query;
        $totalTelat = $totalTelat->where('denda', '>', 0)->count();

        $totalDenda = clone $query;
        $totalDenda = $totalDenda->sum('denda');

        $kelasStats = clone $query;
        $kelasStats = current((array) $kelasStats); // tricky query clone workaround

        $kelasStats = Transaction::selectRaw("REPLACE(members.kelas, '-', ' ') as kelas, COUNT(*) as total")
            ->join('members', 'transactions.member_id', '=', 'members.id');

        $kelasStats = $this->applyFilters($kelasStats, $request);

        $kelasStats = $kelasStats->groupBy('kelas')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status', 'kelas', 'start_date', 'end_date', 'period_type', 'period_date', 'period_month', 'period_year']),
            'stats' => [
                'total_pinjam' => $totalPinjam,
                'total_telat' => $totalTelat,
                'total_denda' => $totalDenda,
            ],
            'kelas_stats' => $kelasStats,
            'kelasOptions' => Member::getUniqueKelas(),
        ]);
    }

    public function exportExcel(Request $request)
    {
        $query = Transaction::with(['member', 'book']);
        $query = $this->applyFilters($query, $request);

        $data = $query->latest()->get();

        return Excel::download(new TransactionsExport($data), 'laporan.xlsx');
    }

    public function exportPdf(Request $request)
    {
        $query = Transaction::with(['member', 'book']);
        $query = $this->applyFilters($query, $request);

        $data = $query->latest()->get();

        $pdf = Pdf::loadView('pdf.report', compact('data', 'request'));
        $pdf->setPaper('a4', 'landscape');

        return $pdf->stream('laporan.pdf');
    }
}
