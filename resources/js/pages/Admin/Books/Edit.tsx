import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminBooksEdit({ book }: any) {
    const { data, setData, post, processing, errors } = useForm({
        kode_buku: book.kode_buku,
        judul: book.judul,
        penulis: book.penulis,
        penerbit: book.penerbit,
        tahun_terbit: book.tahun_terbit,
        kategori: book.kategori,
        stok: book.stok.toString(),
        deskripsi: book.deskripsi || '',
        status: book.status,
        cover_image: null as File | null,
        _method: 'put',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/books/${book.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Kelola Buku', href: '/admin/books' }, { title: 'Edit Buku', href: `/admin/books/${book.id}/edit` }]}>
            <Head title={`Edit ${book.judul}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 max-w-2xl mx-auto w-full">
                <div className="border-border/50 rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <h2 className="text-xl font-bold mb-6">Edit Data Buku</h2>

                    <form onSubmit={submit} className="space-y-4">
                        {/* Same fields as Create, prefilled */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="kode_buku">Kode Buku</Label>
                                <Input id="kode_buku" value={data.kode_buku} onChange={e => setData('kode_buku', e.target.value)} required />
                                {errors.kode_buku && <p className="text-red-500 text-sm mt-1">{errors.kode_buku}</p>}
                            </div>
                            <div>
                                <Label htmlFor="stok">Stok Buku</Label>
                                <Input id="stok" type="number" min="0" value={data.stok} onChange={e => setData('stok', e.target.value)} required />
                                {errors.stok && <p className="text-red-500 text-sm mt-1">{errors.stok}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="judul">Judul Buku</Label>
                            <Input id="judul" value={data.judul} onChange={e => setData('judul', e.target.value)} required />
                            {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="penulis">Penulis</Label>
                                <Input id="penulis" value={data.penulis} onChange={e => setData('penulis', e.target.value)} required />
                                {errors.penulis && <p className="text-red-500 text-sm mt-1">{errors.penulis}</p>}
                            </div>
                            <div>
                                <Label htmlFor="penerbit">Penerbit</Label>
                                <Input id="penerbit" value={data.penerbit} onChange={e => setData('penerbit', e.target.value)} required />
                                {errors.penerbit && <p className="text-red-500 text-sm mt-1">{errors.penerbit}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="tahun_terbit">Tahun Terbit</Label>
                                <Input id="tahun_terbit" value={data.tahun_terbit} onChange={e => setData('tahun_terbit', e.target.value)} required />
                                {errors.tahun_terbit && <p className="text-red-500 text-sm mt-1">{errors.tahun_terbit}</p>}
                            </div>
                            <div>
                                <Label htmlFor="kategori">Kategori</Label>
                                <Input id="kategori" value={data.kategori} onChange={e => setData('kategori', e.target.value)} required />
                                {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>}
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <textarea 
                                id="deskripsi" 
                                value={data.deskripsi} 
                                onChange={e => setData('deskripsi', e.target.value)} 
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                            />
                            {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <select 
                                    id="status" 
                                    value={data.status} 
                                    onChange={e => setData('status', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                            </div>

                            <div>
                                <Label htmlFor="cover_image">Ganti Cover Buku</Label>
                                <Input 
                                    id="cover_image" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={e => setData('cover_image', e.target.files ? e.target.files[0] : null)} 
                                />
                                {errors.cover_image && <p className="text-red-500 text-sm mt-1">{errors.cover_image}</p>}
                                {book.cover_image && !data.cover_image && (
                                    <p className="text-xs text-emerald-600 mt-1">Cover aktif: {book.cover_image}</p>
                                )}
                            </div>
                        </div>

                        <Button type="submit" disabled={processing} className="w-full mt-4 bg-zinc-900 text-white hover:bg-zinc-800">
                            Perbarui Data Buku
                        </Button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
