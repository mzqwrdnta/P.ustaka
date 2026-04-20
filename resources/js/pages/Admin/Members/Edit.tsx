import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';
import { Camera, User } from 'lucide-react';

export default function AdminMembersEdit({ member }: any) {
    const [fotoPreview, setFotoPreview] = useState<string | null>(
        member.foto ? `/storage/${member.foto}` : null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nis: member.nis,
        nama_lengkap: member.nama_lengkap,
        kelas: member.kelas,
        jenis_kelamin: member.jenis_kelamin,
        no_hp: member.no_hp,
        alamat: member.alamat || '',
        status_aktif: member.status_aktif,
        foto: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/members/${member.id}`, {
            forceFormData: true,
        });
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('foto', file);
        const reader = new FileReader();
        reader.onload = () => setFotoPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola Anggota', href: '/admin/members' }, { title: 'Edit Anggota', href: `/admin/members/${member.id}/edit` }]}>
            <Head title={`Edit Anggota: ${member.nama_lengkap}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto w-full">
                <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <h2 className="text-xl font-bold mb-6">Edit Data Anggota</h2>

                    <form onSubmit={submit} className="space-y-6">

                        {/* FOTO UPLOAD */}
                        <div className="flex flex-col items-center gap-3">
                            <div
                                className="relative w-28 h-28 rounded-2xl overflow-hidden bg-stone-100 border-2 border-dashed border-stone-300 cursor-pointer hover:border-amber-400 transition-colors group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {fotoPreview ? (
                                    <img src={fotoPreview} alt="Foto anggota" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-1">
                                        <User className="w-10 h-10" />
                                        <span className="text-xs font-medium">Foto</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-xs text-amber-600 hover:text-amber-700 font-semibold underline">
                                {fotoPreview ? 'Ganti Foto' : 'Upload Foto'}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleFotoChange}
                            />
                            {errors.foto && <p className="text-red-500 text-sm">{errors.foto}</p>}
                            <p className="text-xs text-stone-400">Max 2MB. JPG, PNG, atau WebP.</p>
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
                            Perbarui Data Anggota
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
