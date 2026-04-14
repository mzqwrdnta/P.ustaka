import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage, usePoll } from '@inertiajs/react';
import { useState, useEffect } from 'react';

function formatDate(d?: string | null): string {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRupiah(n: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
        dipinjam: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        dikembalikan: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        ditolak: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300',
    };
    const cls = map[status] ?? (status.includes('pending') ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 animate-pulse' : 'bg-gray-100 text-gray-600');
    return <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${cls}`}>{status.replace(/_/g, ' ')}</span>;
}

function DetailField({ label, value, className = '' }: { label: string; value: React.ReactNode; className?: string }) {
    return (
        <div className={className}>
            <dt className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-0.5">{label}</dt>
            <dd className="text-sm text-gray-900 dark:text-white">{value || '-'}</dd>
        </div>
    );
}

export default function AdminTransactionsReturns({ transactions, filters }: any) {
    const { flash } = usePage<any>().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [kelas, setKelas] = useState(filters?.kelas || '');
    const [start, setStart] = useState(filters?.start_date || '');
    const [end, setEnd] = useState(filters?.end_date || '');
    const [detail, setDetail] = useState<any>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    usePoll(5000, { only: ['transactions'] });

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/admin/transactions/returns',
                { search, kelas, start_date: start, end_date: end },
                { preserveState: true, replace: true },
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, kelas, start, end]);

    const openDetail = async (id: number) => {
        setLoadingDetail(true);
        try {
            const res = await fetch(`/admin/transactions/${id}`, {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
            });
            const data = await res.json();
            setDetail(data);
        } catch {
            // silently fail
        } finally {
            setLoadingDetail(false);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola Pengembalian', href: '/admin/transactions/returns' }]}>
            <Head title="Kelola Pengembalian" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4 w-full min-w-0">
                {flash?.success && <div className="bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 p-4 rounded-xl text-sm font-medium">{flash.success}</div>}

                <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari anggota / NIS / judul buku..."
                        className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
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
                        className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <span className="hidden sm:flex items-center text-gray-400">s/d</span>
                    <input
                        type="date"
                        value={end}
                        onChange={e => setEnd(e.target.value)}
                        className="flex h-10 w-full sm:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="border-border/50 rounded-xl border bg-white shadow-sm dark:bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Kode</th>
                                    <th className="px-4 py-3 font-semibold">Anggota</th>
                                    <th className="px-4 py-3 font-semibold">Buku</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Tanggal</th>
                                    <th className="px-4 py-3 font-semibold">Denda</th>
                                    <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.data.length === 0 && (
                                    <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">Tidak ada data transaksi.</td></tr>
                                )}
                                {transactions.data.map((trx: any) => (
                                    <tr key={trx.id} className="border-t border-gray-100 dark:border-zinc-700/60 hover:bg-gray-50/50 dark:hover:bg-zinc-800/40">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{trx.kode_transaksi}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium">{trx.member?.nama_lengkap}</span>
                                            <span className="block text-xs text-gray-400">{trx.member?.nis}</span>
                                        </td>
                                        <td className="px-4 py-3 max-w-[180px]">
                                            <span className="line-clamp-1">{trx.book?.judul}</span>
                                        </td>
                                        <td className="px-4 py-3"><StatusBadge status={trx.status} /></td>
                                        <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                                            <div>{formatDate(trx.tanggal_pinjam)}</div>
                                            <div className="text-gray-400">{formatDate(trx.tanggal_kembali)}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {trx.denda > 0 ? (
                                                <>
                                                    <span className="font-semibold text-rose-600 dark:text-rose-400 text-xs">{formatRupiah(trx.denda)}</span>
                                                    {trx.status_denda && (
                                                        <span className={`block text-xs mt-0.5 ${trx.status_denda === 'lunas' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                            {trx.status_denda.replace(/_/g, ' ')}
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-gray-300 dark:text-gray-600">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1.5 justify-center">
                                                <button
                                                    onClick={() => openDetail(trx.id)}
                                                    className="text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 px-2.5 py-1.5 rounded font-medium transition-colors"
                                                >
                                                    Detail
                                                </button>
                                                {trx.status === 'pending_pengembalian' && (
                                                    <Link method="post" href={`/admin/transactions/${trx.id}/verify-return`} as="button" className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded font-medium transition-colors">Verifikasi</Link>
                                                )}
                                                {trx.status_denda === 'belum_bayar' && (
                                                    <Link method="post" href={`/admin/transactions/${trx.id}/pay-fine`} as="button" className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded font-medium transition-colors">Lunasi</Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {transactions?.links && (
                        <div className="flex flex-wrap gap-1.5 p-4 border-t dark:border-zinc-700/60">
                            {transactions.links.map((link: any, index: number) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
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
            </div>

            {/* DETAIL MODAL */}
            {(detail || loadingDetail) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { setDetail(null); setLoadingDetail(false); }}>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-zinc-700/60">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Detail Transaksi</h2>
                            <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
                        </div>
                        {loadingDetail && !detail ? (
                            <div className="p-8 text-center text-gray-400">
                                <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin mb-2" />
                                <p className="text-sm">Memuat data...</p>
                            </div>
                        ) : detail && (
                            <div className="p-6 space-y-5">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs text-gray-400">{detail.kode_transaksi}</span>
                                    <StatusBadge status={detail.status} />
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Informasi Anggota</h4>
                                    <dl className="grid grid-cols-2 gap-3">
                                        <DetailField label="Nama" value={detail.member?.nama_lengkap} />
                                        <DetailField label="NIS" value={detail.member?.nis} />
                                        <DetailField label="Kelas" value={detail.member?.kelas} />
                                        <DetailField label="Email" value={detail.member?.user?.email} />
                                    </dl>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Informasi Buku</h4>
                                    <dl><DetailField label="Judul" value={detail.book?.judul} /></dl>
                                </div>

                                <div>
                                    <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Timeline</h4>
                                    <dl className="grid grid-cols-2 gap-3">
                                        <DetailField label="Tgl Pinjam" value={formatDate(detail.tanggal_pinjam)} />
                                        <DetailField label="Jatuh Tempo" value={formatDate(detail.tanggal_jatuh_tempo)} />
                                        <DetailField label="Pengajuan Kembali" value={formatDate(detail.tanggal_pengajuan_kembali)} />
                                        <DetailField label="Tgl Kembali" value={formatDate(detail.tanggal_kembali)} />
                                    </dl>
                                </div>

                                {(detail.denda > 0 || detail.hari_terlambat > 0) && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Denda</h4>
                                        <dl className="grid grid-cols-3 gap-3">
                                            <DetailField label="Hari Terlambat" value={`${detail.hari_terlambat} hari`} />
                                            <DetailField label="Total Denda" value={<span className="text-rose-600 dark:text-rose-400 font-semibold">{formatRupiah(detail.denda)}</span>} />
                                            <DetailField label="Status Denda" value={
                                                <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${detail.status_denda === 'lunas' ? 'bg-emerald-100 text-emerald-700' : detail.status_denda === 'belum_bayar' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {detail.status_denda?.replace(/_/g, ' ')}
                                                </span>
                                            } />
                                        </dl>
                                    </div>
                                )}

                                {detail.catatan_admin && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">Catatan Admin</h4>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-zinc-800 rounded-lg p-3">{detail.catatan_admin}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
