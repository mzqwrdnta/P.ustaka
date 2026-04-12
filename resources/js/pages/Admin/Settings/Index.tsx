import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminSettingsIndex({ settings }: any) {
    const { data, setData, post, processing, errors } = useForm({
        denda_per_hari: settings?.denda_per_hari || '2000',
        maksimal_hari_pinjam: settings?.maksimal_hari_pinjam || '7',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Pengaturan Sistem', href: '/admin/settings' }]}>
            <Head title="Pengaturan Sistem" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl w-full">
                <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <h2 className="text-xl font-bold mb-6">Pengaturan Perpustakaan</h2>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="denda_per_hari">Nominal Denda Per Hari (Rp)</Label>
                            <Input id="denda_per_hari" type="number" value={data.denda_per_hari} onChange={e => setData('denda_per_hari', e.target.value)} required />
                            {errors.denda_per_hari && <p className="text-red-500 text-sm mt-1">{errors.denda_per_hari}</p>}
                        </div>

                        <div>
                            <Label htmlFor="maksimal_hari_pinjam">Maksimal Hari Pinjaman (Hari)</Label>
                            <Input id="maksimal_hari_pinjam" type="number" value={data.maksimal_hari_pinjam} onChange={e => setData('maksimal_hari_pinjam', e.target.value)} required />
                            {errors.maksimal_hari_pinjam && <p className="text-red-500 text-sm mt-1">{errors.maksimal_hari_pinjam}</p>}
                        </div>

                        <Button type="submit" disabled={processing} className="w-full mt-4 bg-zinc-900 text-white hover:bg-zinc-800">
                            Simpan Pengaturan
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
