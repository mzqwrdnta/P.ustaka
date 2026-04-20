import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const selectStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    color: '#1c1917',
};

export default function CompleteProfile() {
    const { data, setData, post, processing, errors } = useForm({
        nis: '',
        nama_lengkap: '',
        kelas: '',
        jenis_kelamin: 'Laki-laki',
        no_hp: '',
        alamat: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/user/profile/complete');
    };

    const ChevronDown = () => (
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f5f0e8] text-stone-900 flex items-center justify-center p-4">
            <Head title="Lengkapi Data Diri">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&display=swap" rel="stylesheet" />
            </Head>
            <style>{`
                .font-serif { font-family: 'Playfair Display', Georgia, serif; }
            `}</style>

            <div className="w-full max-w-2xl bg-white p-8 md:p-10 shadow-2xl rounded-sm border border-stone-200">
                <div className="mb-8 text-center">
                    <p className="text-xs tracking-[0.2em] uppercase text-amber-600 font-semibold mb-2">Selamat Datang di Pustaka</p>
                    <h2 className="font-serif text-3xl font-bold text-stone-900">Lengkapi Data Keanggotaan</h2>
                    <p className="text-stone-500 mt-2 text-sm">Harap isi data diri sekolah Anda sebelum bisa meminjam buku secara digital.</p>
                </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="nis">NIS (Nomor Induk Siswa)</Label>
                            <Input id="nis" value={data.nis} onChange={e => setData('nis', e.target.value)} required />
                            {errors.nis && <p className="text-red-500 text-sm">{errors.nis}</p>}
                        </div>

                        <div>
                            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                            <Input id="nama_lengkap" value={data.nama_lengkap} onChange={e => setData('nama_lengkap', e.target.value)} required className="focus-visible:ring-amber-500" />
                            {errors.nama_lengkap && <p className="text-red-500 text-sm">{errors.nama_lengkap}</p>}
                        </div>

                        <div>
                            <Label htmlFor="kelas">Kelas</Label>
                            <div className="relative">
                                <select
                                    id="kelas"
                                    value={data.kelas}
                                    onChange={e => setData('kelas', e.target.value)}
                                    className="appearance-none w-full h-11 rounded-md border border-stone-300 px-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors cursor-pointer"
                                    style={selectStyle}
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
                                <ChevronDown />
                            </div>
                            {errors.kelas && <p className="text-red-500 text-sm">{errors.kelas}</p>}
                        </div>

                        <div>
                            <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                            <div className="relative">
                                <select
                                    id="jenis_kelamin"
                                    value={data.jenis_kelamin}
                                    onChange={e => setData('jenis_kelamin', e.target.value)}
                                    className="appearance-none w-full h-11 rounded-md border border-stone-300 px-3 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors cursor-pointer"
                                    style={selectStyle}
                                >
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                                <ChevronDown />
                            </div>
                            {errors.jenis_kelamin && <p className="text-red-500 text-sm">{errors.jenis_kelamin}</p>}
                        </div>

                        <div>
                            <Label htmlFor="no_hp">No. HP</Label>
                            <Input id="no_hp" value={data.no_hp} onChange={e => setData('no_hp', e.target.value)} required />
                            {errors.no_hp && <p className="text-red-500 text-sm">{errors.no_hp}</p>}
                        </div>

                        <div>
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input id="alamat" value={data.alamat} onChange={e => setData('alamat', e.target.value)} />
                            {errors.alamat && <p className="text-red-500 text-sm">{errors.alamat}</p>}
                        </div>

                        <Button type="submit" className="w-full mt-6 bg-stone-900 text-[#f5f0e8] hover:bg-amber-500 hover:text-stone-900 font-semibold uppercase tracking-wide h-12 rounded-sm" disabled={processing}>
                            Simpan Data & Lanjutkan
                        </Button>
                    </form>
                </div>
        </div>
    );
}
