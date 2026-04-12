import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AdminBooksIndex({ books, filters = {} }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [stok, setStok] = useState(filters.stok || '');
    const [status, setStatus] = useState(filters.status || '');

    // AUTO FILTER
    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(
                '/admin/books',
                {
                    search,
                    stok,
                    status,
                },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, stok, status]);

    const resetFilter = () => {
        setSearch('');
        setStok('');
        setStatus('');

        router.get('/admin/books', {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola Buku', href: '/admin/books' }]}>
            <Head title="Kelola Buku" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4 w-full min-w-0">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <h2 className="text-xl font-bold">Daftar Buku</h2>
                    <Link
                        href="/admin/books/create"
                        className="bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 font-bold transition-colors"
                    >
                        Tambah Buku
                    </Link>
                </div>

                {/* FILTER */}
                <div className="border rounded-xl p-4 bg-white dark:bg-zinc-900 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

                        {/* SEARCH */}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul / kode / penulis..."
                            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800"
                        />

                        {/* STOK */}
                        <select
                            value={stok}
                            onChange={(e) => setStok(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800"
                        >
                            <option value="">Semua Stok</option>
                            <option value="tersedia">Tersedia</option>
                            <option value="habis">Habis</option>
                        </select>

                        {/* STATUS */}
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm dark:bg-zinc-800"
                        >
                            <option value="">Semua Status</option>
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Nonaktif</option>
                        </select>

                        {/* RESET */}
                        <button
                            onClick={resetFilter}
                            className="px-3 py-2 border rounded-md text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="border-border/50 rounded-xl border bg-white shadow-sm dark:bg-zinc-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200">
                                <tr>
                                    <th className="px-4 py-3">Kode Buku</th>
                                    <th className="px-4 py-3">Cover</th>
                                    <th className="px-4 py-3">Judul</th>
                                    <th className="px-4 py-3">Penulis</th>
                                    <th className="px-4 py-3">Stok</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>

                            <tbody>
                                {books?.data?.map((book: any) => (
                                    <tr key={book.id} className="border-b dark:border-zinc-700">

                                        {/* KODE */}
                                        <td className="px-4 py-3 font-mono">
                                            {book.kode_buku}
                                        </td>

                                        {/* COVER */}
                                        <td className="px-4 py-3">
                                            {book.cover_image ? (
                                                <img
                                                    src={`/storage/${book.cover_image}`}
                                                    alt={book.judul}
                                                    className="w-14 h-20 object-cover rounded shadow"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    No Image
                                                </span>
                                            )}
                                        </td>

                                        {/* JUDUL */}
                                        <td className="px-4 py-3 font-medium">
                                            {book.judul}
                                        </td>

                                        {/* PENULIS */}
                                        <td className="px-4 py-3">
                                            {book.penulis}
                                        </td>

                                        {/* STOK BADGE */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                                    book.stok > 0
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-rose-100 text-rose-700'
                                                }`}
                                            >
                                                {book.stok}
                                            </span>
                                        </td>

                                        {/* STATUS BADGE */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                    book.status
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-rose-100 text-rose-700'
                                                }`}
                                            >
                                                {book.status ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>

                                        {/* AKSI */}
                                        <td className="px-4 py-3 text-right">
                                            <Link
                                                href={`/admin/books/${book.id}/edit`}
                                                className="text-blue-600 hover:text-blue-800 text-xs font-bold px-2 py-1"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={`/admin/books/${book.id}`}
                                                method="delete"
                                                as="button"
                                                className="text-rose-600 hover:text-rose-800 text-xs font-bold px-2 py-1"
                                            >
                                                Hapus
                                            </Link>
                                        </td>
                                    </tr>
                                ))}

                                {(!books?.data || books.data.length === 0) && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8 text-gray-500">
                                            Tidak ada data buku
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {books?.links && (
                        <div className="flex flex-wrap gap-2 p-4 border-t dark:border-zinc-700">
                            {books.links.map((link: any, i: number) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 text-sm rounded border ${
                                        link.active
                                            ? 'bg-zinc-900 text-white dark:bg-emerald-600'
                                            : 'bg-white dark:bg-zinc-900'
                                    } ${!link.url && 'opacity-50 pointer-events-none'}`}
                                    preserveState
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}