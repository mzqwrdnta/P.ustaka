import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import MemberCard, { printCards } from '@/components/MemberCard';

/** ─── MAIN PAGE ────────────────────────────────────────────────────── */
export default function AdminMembersIndex({ members, filters = {}, kelasOptions = [] }: any) {
    const [search, setSearch] = useState((filters as any).search || '');
    const [kelas, setKelas] = useState((filters as any).kelas || '');
    const [jenisKelamin, setJenisKelamin] = useState((filters as any).jenis_kelamin || '');
    const [statusAktif, setStatusAktif] = useState((filters as any).status_aktif || '');
    const [printPreview, setPrintPreview] = useState<any | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/admin/members',
                { search, kelas, jenis_kelamin: jenisKelamin, status_aktif: statusAktif },
                { preserveState: true, replace: true },
            );
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, kelas, jenisKelamin, statusAktif]);

    const resetFilters = () => {
        setSearch('');
        setKelas('');
        setJenisKelamin('');
        setStatusAktif('');
        router.get('/admin/members', {}, { preserveState: true, replace: true });
    };

    /** Cetak semua / yang tampil di halaman ini */
    const printAllVisible = useCallback(() => {
        const list = members?.data ?? [];
        if (!list.length) return;
        printCards(list);
    }, [members]);

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola Anggota', href: '/admin/members' }]}>
            <Head title="Kelola Anggota" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4 w-full min-w-0">
                {/* ── HEADER ── */}
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daftar Anggota</h2>
                    <Link
                        href="/admin/members/create"
                        className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sm font-semibold transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Anggota
                    </Link>
                </div>

                {/* ── FILTER ── */}
                <div className="border-border/50 rounded-xl border bg-white shadow-sm dark:bg-zinc-900 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Cari NIS / Nama</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari anggota..."
                                className="w-full h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Kelas</label>
                            <select
                                value={kelas}
                                onChange={(e) => setKelas(e.target.value)}
                                className="w-full h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
                            >
                                <option value="">Semua Kelas</option>
                                {kelasOptions.map((item: string) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Jenis Kelamin</label>
                            <select
                                value={jenisKelamin}
                                onChange={(e) => setJenisKelamin(e.target.value)}
                                className="w-full h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
                            >
                                <option value="">Semua</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                            <select
                                value={statusAktif}
                                onChange={(e) => setStatusAktif(e.target.value)}
                                className="w-full h-10 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
                            >
                                <option value="">Semua</option>
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={resetFilters}
                                className="w-full h-10 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                Reset Filter
                            </button>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={printAllVisible}
                                disabled={!(members?.data?.length)}
                                className="w-full h-10 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 text-sm font-semibold flex items-center justify-center gap-1.5 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                {kelas ? `Cetak Kelas ${kelas}` : 'Cetak Semua'}
                            </button>
                        </div>
                    </div>

                    {/* Info filter aktif */}
                    {kelas && (
                        <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Tombol cetak hanya akan mencetak anggota kelas <strong>{kelas}</strong> yang tampil di halaman ini.
                        </div>
                    )}
                </div>

                {/* ── TABLE ── */}
                <div className="border-border/50 rounded-xl border bg-white shadow-sm dark:bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">NIS</th>
                                    <th className="px-4 py-3 font-semibold">Nama Lengkap</th>
                                    <th className="px-4 py-3 font-semibold">Kelas</th>
                                    <th className="px-4 py-3 font-semibold">Jenis Kelamin</th>
                                    <th className="px-4 py-3 font-semibold">No HP</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members?.data?.map((member: any) => (
                                    <tr key={member.id} className="border-t border-gray-100 dark:border-zinc-700/60 hover:bg-gray-50/50 dark:hover:bg-zinc-800/40">
                                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{member.nis}</td>
                                        <td className="px-4 py-3 font-medium">{member.nama_lengkap}</td>
                                        <td className="px-4 py-3">{member.kelas}</td>
                                        <td className="px-4 py-3">{member.jenis_kelamin}</td>
                                        <td className="px-4 py-3">{member.no_hp}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                member.status_aktif
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                            }`}>
                                                {member.status_aktif ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1.5 justify-center">
                                                <button
                                                    onClick={() => printCards([member])}
                                                    className="text-xs bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1.5 rounded font-medium transition-colors flex items-center gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                    </svg>
                                                    Cetak
                                                </button>
                                                <Link
                                                    href={`/admin/members/${member.id}/edit`}
                                                    className="text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2.5 py-1.5 rounded font-medium transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/admin/members/${member.id}`}
                                                    method="delete"
                                                    as="button"
                                                    className="text-xs bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-2.5 py-1.5 rounded font-medium transition-colors"
                                                >
                                                    Hapus
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {(!members?.data || members.data.length === 0) && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-10 text-gray-400">
                                            Tidak ada data anggota
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {members?.links && (
                        <div className="flex flex-wrap gap-1.5 p-4 border-t dark:border-zinc-700/60">
                            {members.links.map((link: any, index: number) => (
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

                {/* ── CARD PREVIEW MODAL (single) ─ dipicu dari inline preview ── */}
                {printPreview && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                        onClick={() => setPrintPreview(null)}
                    >
                        <div
                            className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl p-6 flex flex-col gap-4 max-w-sm w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Preview Kartu</h3>
                                <button onClick={() => setPrintPreview(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
                            </div>
                            <MemberCard member={printPreview} />
                            <button
                                onClick={() => { printCards([printPreview]); setPrintPreview(null); }}
                                className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Cetak Kartu
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}