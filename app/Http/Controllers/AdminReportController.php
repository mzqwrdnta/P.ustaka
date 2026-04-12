<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Transaction;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TransactionsExport;

class AdminReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::with(['member', 'book']);

        if ($request->search) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->whereHas('member', fn($m) => $m->where('nama_lengkap', 'like', "%$search%"))
                  ->orWhereHas('book', fn($b) => $b->where('judul', 'like', "%$search%"));
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
            $query->whereHas('member', fn($q) => $q->where('kelas', $request->kelas));
        }

        if ($request->start_date && $request->end_date) {
            $query->whereBetween('tanggal_pinjam', [
                $request->start_date,
                $request->end_date
            ]);
        }

        $transactions = $query->latest()->paginate(10)->withQueryString();

        // stats
        $totalPinjam = (clone $query)->count();
        $totalTelat = (clone $query)->where('denda', '>', 0)->count();
        $totalDenda = (clone $query)->sum('denda');

        $kelasStats = Transaction::selectRaw('members.kelas, COUNT(*) as total')
            ->join('members', 'transactions.member_id', '=', 'members.id')
            ->groupBy('members.kelas')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Reports/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status', 'kelas', 'start_date', 'end_date']),
            'stats' => [
                'total_pinjam' => $totalPinjam,
                'total_telat' => $totalTelat,
                'total_denda' => $totalDenda,
            ],
            'kelas_stats' => $kelasStats,
        ]);
    }

    public function exportExcel()
    {
        return Excel::download(new TransactionsExport, 'laporan.xlsx');
    }

    public function exportPdf()
    {
        $data = Transaction::with(['member', 'book'])->get();

        $pdf = Pdf::loadView('pdf.report', compact('data'));

        return $pdf->download('laporan.pdf');
    }
}