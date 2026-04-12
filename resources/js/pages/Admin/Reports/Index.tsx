import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

interface Transaction {
    id: number;
    kode_transaksi?: string;
    member?: { nama_lengkap: string; nis?: string; kelas?: string };
    book?: { judul: string };
    status: string;
    status_denda?: string;
    tanggal_pinjam?: string;
    tanggal_kembali?: string;
    denda: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginated {
    data: Transaction[];
    links: PaginationLink[];
}

interface KelasStats {
    kelas: string;
    total: number;
}

interface Stats {
    total_pinjam: number;
    total_telat: number;
    total_denda: number;
}

interface Filters {
    search?: string;
    status?: string;
    kelas?: string;
    start_date?: string;
    end_date?: string;
}

function formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

function statusBadge(status: string) {
    const map: Record<string, string> = {
        dipinjam: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        dikembalikan: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        ditolak: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    };
    const cls = map[status] ?? (status.includes('pending') ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-gray-100 text-gray-600');
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{status.replace(/_/g, ' ')}</span>;
}

export default function AdminReportsIndex({ transactions, filters, stats, kelas_stats }: {
    transactions: Paginated;
    filters: Filters;
    stats: Stats;
    kelas_stats: KelasStats[];
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [kelas, setKelas] = useState(filters.kelas ?? '');
    const [start, setStart] = useState(filters.start_date ?? '');
    const [end, setEnd] = useState(filters.end_date ?? '');
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                '/admin/reports',
                { search, status, kelas, start_date: start, end_date: end },
                { preserveState: true, replace: true },
            );
        }, 400);
        return () => clearTimeout(t);
    }, [search, status, kelas, start, end]);

    const handlePrint = () => {
        const content = printRef.current;
        if (!content) return;
        const win = window.open('', '_blank');
        if (!win) return;
        win.document.write(`
            <html>
            <head>
                <title>Laporan Transaksi - Perpustakaan</title>
                <style>
                    * { box-sizing: border-box; margin: 0; padding: 0; }
                    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; padding: 20px; }
                    .print-header { text-align: center; margin-bottom: 16px; border-bottom: 2px solid #333; padding-bottom: 12px; }
                    .print-header h1 { font-size: 16px; font-weight: bold; margin-bottom: 4px; }
                    .print-header p { font-size: 11px; color: #555; }
                    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px; }
                    .stat-card { border: 1px solid #ddd; padding: 10px; border-radius: 6px; text-align: center; }
                    .stat-card p { font-size: 10px; color: #555; margin-bottom: 4px; }
                    .stat-card h2 { font-size: 15px; font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
                    thead { background: #f1f5f9; }
                    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; vertical-align: top; }
                    th { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #444; }
                    tr:nth-child(even) { background: #fafafa; }
                    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; border: 1px solid #ccc; }
                    .section-title { font-size: 12px; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
                    .kelas-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #f0f0f0; }
                    .footer { margin-top: 24px; font-size: 10px; color: #888; text-align: right; }
                </style>
            </head>
            <body>${content.innerHTML}</body>
            </html>
        `);
        win.document.close();
        win.focus();
        win.print();
        win.close();
    };

    const printDate = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <AppLayout breadcrumbs={[{ title: 'Laporan Transaksi', href: '/admin/reports' }]}>
            <Head title="Laporan Transaksi" />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-4 w-full min-w-0">

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border-border/50 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm p-5 flex flex-col gap-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Total Pinjam</p>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_pinjam}</h2>
                        <p className="text-xs text-gray-400">transaksi ditemukan</p>
                    </div>
                    <div className="border-border/50 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm p-5 flex flex-col gap-1">
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium uppercase tracking-wide">Terlambat</p>
                        <h2 className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.total_telat}</h2>
                        <p className="text-xs text-gray-400">ada keterlambatan</p>
                    </div>
                    <div className="border-border/50 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm p-5 flex flex-col gap-1">
                        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium uppercase tracking-wide">Total Denda</p>
                        <h2 className="text-3xl font-bold text-rose-600 dark:text-rose-400">{formatRupiah(stats.total_denda)}</h2>
                        <p className="text-xs text-gray-400">akumulasi denda</p>
                    </div>
                </div>

                {/* FILTER + EXPORT */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari nama anggota / judul buku..."
                        className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Semua Status</option>
                        <option value="dipinjam">Dipinjam</option>
                        <option value="dikembalikan">Dikembalikan</option>
                        <option value="terlambat">Terlambat</option>
                    </select>
                    <select
                        value={kelas}
                        onChange={e => setKelas(e.target.value)}
                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Semua Kelas</option>
                        <option value="X PPLG">X PPLG</option>
                        <option value="XI PPLG">XI PPLG</option>
                        <option value="XII PPLG">XII PPLG</option>
                    </select>
                    <input
                        type="date"
                        value={start}
                        onChange={e => setStart(e.target.value)}
                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <input
                        type="date"
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                        className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />

                    <div className="flex gap-2 sm:ml-auto">
                        <button
                            onClick={() => setShowPrintPreview(true)}
                            className="flex h-10 items-center gap-2 px-4 rounded-md border border-input bg-background text-sm hover:bg-gray-50 dark:hover:bg-zinc-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Cetak
                        </button>
                        <a
                            href="/admin/reports/export-excel"
                            className="flex h-10 items-center gap-2 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Excel
                        </a>
                        <a
                            href="/admin/reports/export-pdf"
                            className="flex h-10 items-center gap-2 px-4 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            PDF
                        </a>
                    </div>
                </div>

                {/* TRANSACTION TABLE */}
                <div className="border-border/50 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Anggota</th>
                                    <th className="px-4 py-3 font-semibold">Buku</th>
                                    <th className="px-4 py-3 font-semibold">Kelas</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Tgl Pinjam</th>
                                    <th className="px-4 py-3 font-semibold">Tgl Kembali</th>
                                    <th className="px-4 py-3 font-semibold text-right">Denda</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-10 text-center text-gray-400 dark:text-gray-500">
                                            Tidak ada data transaksi.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.data.map((trx) => (
                                        <tr key={trx.id} className="border-t border-gray-100 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                            <td className="px-4 py-3 font-medium">
                                                {trx.member?.nama_lengkap ?? '-'}
                                                {trx.member?.nis && (
                                                    <span className="block text-xs font-normal text-gray-400">{trx.member.nis}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 max-w-[180px]">
                                                <span className="line-clamp-2">{trx.book?.judul ?? '-'}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                                                {trx.member?.kelas ?? '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {statusBadge(trx.status)}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {formatDate(trx.tanggal_pinjam)}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                                                {formatDate(trx.tanggal_kembali)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {trx.denda > 0 ? (
                                                    <span>
                                                        <span className="font-semibold text-rose-600 dark:text-rose-400">{formatRupiah(trx.denda)}</span>
                                                        {trx.status_denda && (
                                                            <span className={`block text-xs mt-0.5 ${trx.status_denda === 'lunas' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                                {trx.status_denda.replace(/_/g, ' ')}
                                                            </span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {transactions?.links && (
                        <div className="flex flex-wrap gap-2 p-4 border-t dark:border-zinc-700">
                            {transactions.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-md text-sm border ${
                                        link.active
                                            ? 'bg-zinc-900 text-white dark:bg-emerald-600 border-zinc-900 dark:border-emerald-600'
                                            : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700'
                                    } ${!link.url ? 'opacity-50 pointer-events-none' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                    preserveState
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* KELAS TERAKTIF */}
                <div className="border-border/50 rounded-xl border bg-white dark:bg-zinc-900 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4 uppercase tracking-wide">
                        Kelas Teraktif
                    </h3>
                    <div className="space-y-2">
                        {kelas_stats.length === 0 && (
                            <p className="text-sm text-gray-400">Tidak ada data.</p>
                        )}
                        {kelas_stats.map((k, i) => {
                            const max = kelas_stats[0]?.total ?? 1;
                            const pct = Math.round((k.total / max) * 100);
                            return (
                                <div key={k.kelas} className="flex items-center gap-3">
                                    <span className="w-5 text-xs font-bold text-gray-400">#{i + 1}</span>
                                    <span className="w-28 text-sm font-medium text-gray-700 dark:text-gray-200">{k.kelas}</span>
                                    <div className="flex-1 bg-gray-100 dark:bg-zinc-700 rounded-full h-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 w-8 text-right">{k.total}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* PRINT PREVIEW MODAL */}
            {showPrintPreview && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-4xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-zinc-700">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Preview Cetak Laporan</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Cetak Sekarang
                                </button>
                                <button
                                    onClick={() => setShowPrintPreview(false)}
                                    className="flex items-center gap-1 px-3 py-2 rounded-md border border-input bg-background text-sm hover:bg-gray-50 dark:hover:bg-zinc-800"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>

                        {/* Print content preview */}
                        <div className="p-6 overflow-x-auto">
                            <div ref={printRef} className="bg-white text-gray-900 p-6 rounded border border-gray-200 min-w-[600px] text-xs font-['Arial']">
                                {/* Print Header */}
                                <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                                    <h1 className="text-base font-bold uppercase tracking-wide">Laporan Transaksi Peminjaman Buku</h1>
                                    <p className="text-gray-500 text-xs mt-1">Perpustakaan Sekolah &mdash; Dicetak pada {printDate}</p>
                                    {(start || end) && (
                                        <p className="text-gray-500 text-xs">
                                            Periode: {start ? formatDate(start) : '...'} s/d {end ? formatDate(end) : '...'}
                                        </p>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[
                                        { label: 'Total Pinjam', value: String(stats.total_pinjam) },
                                        { label: 'Terlambat', value: String(stats.total_telat) },
                                        { label: 'Total Denda', value: formatRupiah(stats.total_denda) },
                                    ].map(s => (
                                        <div key={s.label} className="border border-gray-300 rounded p-3 text-center">
                                            <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">{s.label}</p>
                                            <p className="font-bold text-sm">{s.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Table */}
                                <table className="w-full border-collapse text-[10px] mb-4">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-2 py-1.5 text-left font-bold uppercase">#</th>
                                            <th className="border border-gray-300 px-2 py-1.5 text-left font-bold uppercase">Anggota</th>
                                            <th className="border border-gray-300 px-2 py-1.5 text-left font-bold uppercase">Kelas</th>
                                            <th className="border border-gray-300 px-2 py-1.5 text-left font-bold uppercase">Buku</th>
                                            <th className="border border-gray-300 px-2 py-1.5 text-left font-bold uppercase">Status</th>
                                            <th className="border border-gray-300 px-2 py-1.5 text-left font-bold uppercase">Tgl Pinjam</th>
                                            <th className="border border-gray-300 px-2 py-1.5 text-left font-bold uppercase">Tgl Kembali</th>
                                            <th className="border border-gray-300 px-2 py-1.5 text-right font-bold uppercase">Denda</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.data.map((trx, idx) => (
                                            <tr key={trx.id} className={idx % 2 === 1 ? 'bg-gray-50' : ''}>
                                                <td className="border border-gray-300 px-2 py-1">{idx + 1}</td>
                                                <td className="border border-gray-300 px-2 py-1">
                                                    <div className="font-medium">{trx.member?.nama_lengkap ?? '-'}</div>
                                                    <div className="text-gray-400">{trx.member?.nis ?? ''}</div>
                                                </td>
                                                <td className="border border-gray-300 px-2 py-1">{trx.member?.kelas ?? '-'}</td>
                                                <td className="border border-gray-300 px-2 py-1">{trx.book?.judul ?? '-'}</td>
                                                <td className="border border-gray-300 px-2 py-1">{trx.status.replace(/_/g, ' ')}</td>
                                                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">{formatDate(trx.tanggal_pinjam)}</td>
                                                <td className="border border-gray-300 px-2 py-1 whitespace-nowrap">{formatDate(trx.tanggal_kembali)}</td>
                                                <td className="border border-gray-300 px-2 py-1 text-right">
                                                    {trx.denda > 0 ? formatRupiah(trx.denda) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Kelas Teraktif */}
                                {kelas_stats.length > 0 && (
                                    <div>
                                        <p className="font-bold text-[10px] uppercase border-b border-gray-300 pb-1 mb-2">Kelas Teraktif</p>
                                        {kelas_stats.map((k, i) => (
                                            <div key={k.kelas} className="flex justify-between py-1 border-b border-gray-100 text-[10px]">
                                                <span>#{i + 1} &nbsp; {k.kelas}</span>
                                                <span className="font-semibold">{k.total} transaksi</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="mt-6 text-right text-[10px] text-gray-400">
                                    Dicetak oleh sistem perpustakaan &mdash; {printDate}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}