import React from 'react';
import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';
import { Copy, CheckCircle2, Printer } from 'lucide-react';
import { useState } from 'react';

import MemberCard, { printCards } from '@/components/MemberCard';

export default function UserProfile({ user, member }: any) {
    const [copied, setCopied] = useState(false);

    const handleCopyNis = () => {
        if (!member?.nis) return;
        navigator.clipboard.writeText(member.nis);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <UserLayout>
            <Head title="Profil Saya" />
            
            <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 md:py-12 animate-[fadeUp_0.4s_ease_both]">
                <div className="text-center mb-10">
                    <h1 className="font-serif text-3xl md:text-4xl font-black text-stone-900 mb-2">Profil Keanggotaan</h1>
                    <p className="text-stone-400 text-sm md:text-base font-light italic">Lihat kartu digital dan identitas perpustakaan Anda.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* DIGITAL CARD PREVIEW - RESPONSIVE CONTAINER */}
                    <div className="w-full md:w-auto flex-shrink-0 flex justify-center items-center p-6 md:p-8 bg-white border border-stone-200/60 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                        <div className="transform scale-90 sm:scale-100 md:scale-110 origin-center">
                            <MemberCard member={member} />
                        </div>
                    </div>

                    {/* MEMBER DETAILS LIST */}
                    <div className="flex-1 w-full bg-white border border-stone-200/60 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
                            {/* AVATAR */}
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-200 flex-shrink-0 shadow-md">
                                {member?.foto
                                    ? <img src={`/storage/${member.foto}`} alt={member.nama_lengkap} className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-800 to-stone-900">
                                        <span className="text-amber-400 font-serif font-black text-2xl">
                                            {member?.nama_lengkap?.charAt(0)?.toUpperCase()}
                                        </span>
                                      </div>
                                }
                            </div>
                            <div>
                                <h3 className="font-black text-lg text-stone-900 leading-tight">{member?.nama_lengkap}</h3>
                                <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">{member?.kelas}</p>
                                <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${member?.status_aktif ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${member?.status_aktif ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                    {member?.status_aktif ? 'Aktif' : 'Nonaktif'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Email Pengguna</span>
                                <span className="block text-sm font-medium text-stone-700">{user?.email}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Nomor Induk / NIS</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-md border border-stone-200 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {member?.nis}
                                        </span>
                                        <button 
                                            onClick={handleCopyNis}
                                            title="Salin NIS"
                                            className="p-1.5 text-stone-400 hover:text-amber-500 bg-stone-50 hover:bg-amber-50 rounded-md border border-stone-200 transition-colors"
                                        >
                                            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Kelas</span>
                                    <span className="block text-sm font-bold text-stone-700">{member?.kelas}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Jenkel</span>
                                    <span className="block text-sm font-medium text-stone-700">{member?.jenis_kelamin}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Kontak/HP</span>
                                    <span className="block text-sm font-medium text-stone-700">{member?.no_hp}</span>
                                </div>
                            </div>
                        </div>

                        {/* PRINT BUTTON */}
                        <div className="mt-8 pt-6 border-t border-stone-100">
                            <button
                                onClick={() => printCards([member])}
                                className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white py-3 px-6 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95"
                            >
                                <Printer className="w-4 h-4" />
                                Cetak Kartu Anggota
                            </button>
                            <p className="text-[10px] text-stone-400 text-center mt-3 font-medium">
                                Gunakan kartu ini untuk mempermudah proses peminjaman buku.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </UserLayout>
    );
}
