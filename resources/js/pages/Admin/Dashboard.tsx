import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats }: any) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />
            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4 min-w-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <h3 className="text-lg font-bold">Total Buku</h3>
                        <p className="text-3xl mt-2">{stats.total_books}</p>
                    </div>
                    <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <h3 className="text-lg font-bold">Total Anggota</h3>
                        <p className="text-3xl mt-2">{stats.total_members}</p>
                    </div>
                    <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <h3 className="text-lg font-bold">Buku Dipinjam</h3>
                        <p className="text-3xl mt-2">{stats.books_borrowed}</p>
                    </div>
                    <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <h3 className="text-lg font-bold">Pending Pinjam</h3>
                        <p className="text-3xl mt-2">{stats.pending_borrows}</p>
                    </div>
                    <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <h3 className="text-lg font-bold">Pending Kembali</h3>
                        <p className="text-3xl mt-2">{stats.pending_returns}</p>
                    </div>
                    <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <h3 className="text-lg font-bold">Denda Belum Lunas</h3>
                        <p className="text-3xl mt-2 text-red-500">Rp {stats.unpaid_fines}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
