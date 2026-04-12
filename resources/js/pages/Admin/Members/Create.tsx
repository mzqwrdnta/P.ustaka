import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminMembersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        nis: '',
        nama_lengkap: '',
        kelas: '',
        jenis_kelamin: 'Laki-laki',
        no_hp: '',
        alamat: '',
        status_aktif: true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/members');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola Anggota', href: '/admin/members' }, { title: 'Tambah Anggota', href: '/admin/members/create' }]}>
            <Head title="Tambah Anggota" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto w-full">
                <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <h2 className="text-xl font-bold mb-6">Tambah Anggota (Beserta Akun Login)</h2>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4 border-zinc-200 dark:border-zinc-800">
                            <div>
                                <Label htmlFor="email">Email Login</Label>
                                <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} required />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password">Password Mula-mula</Label>
                                <Input id="password" type="text" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nis">NIS</Label>
                                <Input id="nis" value={data.nis} onChange={e => setData('nis', e.target.value)} required />
                                {errors.nis && <p className="text-red-500 text-sm mt-1">{errors.nis}</p>}
                            </div>
                            <div>
                                <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                                <Input id="nama_lengkap" value={data.nama_lengkap} onChange={e => setData('nama_lengkap', e.target.value)} required />
                                {errors.nama_lengkap && <p className="text-red-500 text-sm mt-1">{errors.nama_lengkap}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="kelas">Kelas</Label>
                                <select
                                id="kelas"
                                value={data.kelas}
                                onChange={e => setData('kelas', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                            >
                                <option value="X-PPLG">X PPLG</option>
                                <option value="XI-PPLG">XI PPLG</option>
                                <option value="XII-PPLG">XII PPLG</option>

                                <option value="X-AKL">X AKL</option>
                                <option value="XI-AKL">XI AKL</option>
                                <option value="XII-AKL">XII AKL</option>

                                <option value="X-MPLB">X MPLB</option>
                                <option value="XI-MPLB">XI MPLB</option>
                                <option value="XII-MPLB">XII MPLB</option>
                            </select>
                                {errors.kelas && <p className="text-red-500 text-sm mt-1">{errors.kelas}</p>}
                            </div>
                            <div>
                                <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                                <select 
                                    id="jenis_kelamin" 
                                    value={data.jenis_kelamin} 
                                    onChange={e => setData('jenis_kelamin', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                                >
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                                {errors.jenis_kelamin && <p className="text-red-500 text-sm mt-1">{errors.jenis_kelamin}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="no_hp">No. HP</Label>
                            <Input id="no_hp" value={data.no_hp} onChange={e => setData('no_hp', e.target.value)} required />
                            {errors.no_hp && <p className="text-red-500 text-sm mt-1">{errors.no_hp}</p>}
                        </div>

                        <div>
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input id="alamat" value={data.alamat} onChange={e => setData('alamat', e.target.value)} />
                            {errors.alamat && <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>}
                        </div>

                        <div>
                            <Label htmlFor="status_aktif">Status Anggota</Label>
                            <select 
                                id="status_aktif" 
                                value={data.status_aktif ? '1' : '0'} 
                                onChange={e => setData('status_aktif', e.target.value === '1')}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                            >
                                <option value="1">Aktif</option>
                                <option value="0">Nonaktif</option>
                            </select>
                            {errors.status_aktif && <p className="text-red-500 text-sm mt-1">{errors.status_aktif}</p>}
                        </div>

                        <Button type="submit" disabled={processing} className="w-full mt-4 bg-zinc-900 text-white hover:bg-zinc-800">
                            Simpan Anggota Baru
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
