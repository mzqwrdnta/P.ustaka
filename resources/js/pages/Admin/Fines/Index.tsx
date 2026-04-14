import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { CircleDollarSign, Search, CheckCircle2, AlertCircle } from 'lucide-react';

function formatDate(d?: string | null): string {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRupiah(n: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export default function AdminFinesIndex({ fines, filters }: any) {
    const { flash } = usePage<any>().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [selectedFine, setSelectedFine] = useState<any>(null);
    const [payAmount, setPayAmount] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/admin/fines',
                { search, status },
                { preserveState: true, replace: true },
            );
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, status]);

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFine || !payAmount) return;
        
        setProcessing(true);
        router.post(`/admin/fines/${selectedFine.id}`, {
            bayar: payAmount
        }, {
            onSuccess: () => {
                setSelectedFine(null);
                setPayAmount('');
            },
            onFinish: () => setProcessing(false)
        });
    };

    const handleFullPay = (trx: any) => {
        if (!confirm('Lunasi seluruh denda ini?')) return;
        
        router.post(`/admin/fines/${trx.id}`, {
            status_denda: 'lunas'
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola Denda', href: '/admin/fines' }]}>
            <Head title="Kelola Denda" />
            
            <div className="flex flex-1 flex-col gap-6 rounded-xl p-4 w-full min-w-0">
                {flash?.success && <div className="bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 p-4 rounded-xl text-sm font-medium flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {flash.success}</div>}
                {flash?.error && <div className="bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300 p-4 rounded-xl text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {flash.error}</div>}

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Cari anggota atau judul buku..."
                            className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20"
                    >
                        <option value="">Semua Status Denda</option>
                        <option value="belum_bayar">Belum Lunas</option>
                        <option value="lunas">Lunas</option>
                    </select>
                </div>

                <div className="border-border/50 rounded-xl border bg-white shadow-sm dark:bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-center w-10">#</th>
                                    <th className="px-4 py-3 font-semibold">Anggota</th>
                                    <th className="px-4 py-3 font-semibold">Buku</th>
                                    <th className="px-4 py-3 font-semibold">Terlambat</th>
                                    <th className="px-4 py-3 font-semibold">Total Denda</th>
                                    <th className="px-4 py-3 font-semibold">Sisa Denda</th>
                                    <th className="px-4 py-3 font-semibold text-center">Status</th>
                                    <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fines.data.length === 0 && (
                                    <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">Tidak ada data denda ditemukan.</td></tr>
                                )}
                                {fines.data.map((trx: any, idx: number) => {
                                    const sisa = trx.denda - (trx.denda_dibayar || 0);
                                    return (
                                        <tr key={trx.id} className="border-t border-gray-100 dark:border-zinc-700/60 hover:bg-gray-50/50 dark:hover:bg-zinc-800/40">
                                            <td className="px-4 py-3 text-center text-gray-400">{idx + 1}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900 dark:text-white">{trx.member?.nama_lengkap}</div>
                                                <div className="text-xs text-gray-400">{trx.member?.nis} &bull; {trx.member?.kelas}</div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                                                <span className="line-clamp-1">{trx.book?.judul}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{trx.hari_terlambat} hari</td>
                                            <td className="px-4 py-3 font-medium">{formatRupiah(trx.denda)}</td>
                                            <td className="px-4 py-3">
                                                {sisa > 0 ? (
                                                    <span className="font-semibold text-rose-600 dark:text-rose-400">{formatRupiah(sisa)}</span>
                                                ) : (
                                                    <span className="text-emerald-600 font-medium">Lunas</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${trx.status_denda === 'lunas' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'}`}>
                                                    {trx.status_denda?.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2 justify-center">
                                                    {trx.status_denda !== 'lunas' && (
                                                        <>
                                                            <button
                                                                onClick={() => setSelectedFine(trx)}
                                                                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5"
                                                            >
                                                                <CircleDollarSign className="w-3.5 h-3.5" />
                                                                Bayar
                                                            </button>
                                                            <button
                                                                onClick={() => handleFullPay(trx)}
                                                                className="text-xs border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-1.5 rounded-md font-medium transition-colors"
                                                            >
                                                                Lunasi
                                                            </button>
                                                            <Link
                                                                method="post"
                                                                href={`/admin/transactions/${trx.id}/send-reminder`}
                                                                as="button"
                                                                className="text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                                </svg>
                                                                WA
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* PAYMENT MODAL */}
            {selectedFine && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedFine(null)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b dark:border-zinc-700/60 flex items-center justify-between bg-emerald-600 text-white">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <CircleDollarSign className="w-5 h-5" />
                                Pembayaran Denda
                            </h2>
                            <button onClick={() => setSelectedFine(null)} className="text-white/70 hover:text-white text-2xl leading-none transition-colors">&times;</button>
                        </div>
                        
                        <form onSubmit={handlePay} className="p-6 space-y-5">
                            <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Total Denda</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{formatRupiah(selectedFine.denda)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Sudah Dibayar</span>
                                    <span className="font-bold text-emerald-600">{formatRupiah(selectedFine.denda_dibayar || 0)}</span>
                                </div>
                                <div className="pt-2 border-t dark:border-zinc-700 flex justify-between">
                                    <span className="text-gray-900 dark:text-white font-medium">Sisa Denda</span>
                                    <span className="font-bold text-lg text-rose-600">{formatRupiah(selectedFine.denda - (selectedFine.denda_dibayar || 0))}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Jumlah Bayar Baru</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Rp</span>
                                    <input
                                        type="number"
                                        autoFocus
                                        value={payAmount}
                                        onChange={e => setPayAmount(e.target.value)}
                                        placeholder="0"
                                        max={selectedFine.denda - (selectedFine.denda_dibayar || 0)}
                                        className="flex h-12 w-full rounded-xl border border-input bg-background pl-10 pr-3 py-2 text-lg font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-gray-400">Masukkan jumlah uang yang diterima dari siswa.</p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedFine(null)}
                                    className="flex-1 h-12 rounded-xl border border-input hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm font-semibold transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !payAmount}
                                    className="flex-2 h-12 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {processing ? 'Memproses...' : 'Simpan Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
