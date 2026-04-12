import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function formatDate(d?: string | null): string {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <dt className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide mb-0.5">{label}</dt>
            <dd className="text-sm text-gray-900 dark:text-white">{value || '-'}</dd>
        </div>
    );
}

export default function AdminMembersIndex({ members, filters = {}, kelasOptions = [] }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [kelas, setKelas] = useState(filters.kelas || '');
    const [jenisKelamin, setJenisKelamin] = useState(filters.jenis_kelamin || '');
    const [statusAktif, setStatusAktif] = useState(filters.status_aktif || '');
    const [detail, setDetail] = useState<any>(null);

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

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola Anggota', href: '/admin/members' }]}>
            <Head title="Kelola Anggota" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4 w-full min-w-0">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daftar Anggota</h2>
                    <Link
                        href="/admin/members/create"
                        className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-lg hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-sm font-semibold transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Tambah Anggota
                    </Link>
                </div>

                {/* FILTER */}
                <div className="border-border/50 rounded-xl border bg-white shadow-sm dark:bg-zinc-900 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
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
                    </div>
                </div>

                {/* TABLE */}
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
                                    <th className="px-4 py-3 font-semibold text-right">Aksi</th>
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
                                            <span
                                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    member.status_aktif
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                                }`}
                                            >
                                                {member.status_aktif ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex gap-1.5 justify-end">
                                                <button
                                                    onClick={() => setDetail(member)}
                                                    className="text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 px-2.5 py-1.5 rounded font-medium transition-colors"
                                                >
                                                    Detail
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
            </div>

            {/* DETAIL MODAL */}
            {detail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDetail(null)}>
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-zinc-700/60">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Detail Anggota</h2>
                            <button onClick={() => setDetail(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-lg font-bold shrink-0">
                                    {detail.nama_lengkap?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{detail.nama_lengkap}</h3>
                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                        detail.status_aktif 
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                    }`}>
                                        {detail.status_aktif ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Data Pribadi</h4>
                                <dl className="grid grid-cols-2 gap-3">
                                    <DetailField label="NIS" value={<span className="font-mono">{detail.nis}</span>} />
                                    <DetailField label="Kelas" value={detail.kelas} />
                                    <DetailField label="Jenis Kelamin" value={detail.jenis_kelamin} />
                                    <DetailField label="No HP" value={detail.no_hp} />
                                </dl>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-3">Kontak & Lainnya</h4>
                                <dl className="space-y-3">
                                    <DetailField label="Email" value={detail.user?.email} />
                                    <DetailField label="Alamat" value={detail.alamat || <span className="text-gray-400 italic">Belum diisi</span>} />
                                    <DetailField label="Terdaftar Sejak" value={formatDate(detail.created_at)} />
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}