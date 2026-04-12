import { Head, Link, usePage, usePoll, router } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  pending_peminjaman:  { label: 'Pending Pinjam',  dot: 'bg-yellow-400',  text: 'text-yellow-800',  bg: 'bg-yellow-100'  },
  dipinjam:            { label: 'Dipinjam',         dot: 'bg-blue-400',    text: 'text-blue-800',    bg: 'bg-blue-100'    },
  pending_pengembalian:{ label: 'Pending Kembali',  dot: 'bg-orange-400',  text: 'text-orange-800',  bg: 'bg-orange-100'  },
  dikembalikan:        { label: 'Dikembalikan',     dot: 'bg-emerald-500', text: 'text-emerald-800', bg: 'bg-emerald-100' },
  ditolak:             { label: 'Ditolak',          dot: 'bg-rose-400',    text: 'text-rose-800',    bg: 'bg-rose-100'    },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] ?? { label: status, dot: 'bg-stone-400', text: 'text-stone-700', bg: 'bg-stone-100' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function TransactionsIndex({ transactions, filters }: any) {
  const { flash } = usePage<any>().props;

  usePoll(5000, { only: ['transactions'] });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    router.get('/user/transactions', {
      search: formData.get('search'),
      status: formData.get('status'),
    }, { preserveState: true });
  };

  return (
    <UserLayout>
      <Head title="Riwayat Transaksi" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* FLASH */}
        {flash?.success && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg border-l-4 border-emerald-500 text-sm font-medium shadow-sm">
            <span className="text-emerald-600 bg-emerald-100 rounded-full w-5 h-5 flex items-center justify-center">✓</span>
            {flash.success}
          </div>
        )}
        {flash?.error && (
          <div className="mb-6 flex items-center gap-3 bg-rose-50 text-rose-800 px-4 py-3 rounded-lg border-l-4 border-rose-500 text-sm font-medium shadow-sm">
            <span className="text-rose-600 bg-rose-100 rounded-full w-5 h-5 flex items-center justify-center">✕</span>
            {flash.error}
          </div>
        )}

        {/* PAGE HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-amber-600 font-bold mb-1">✦ Aktivitas Anda</p>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-stone-900 leading-tight">Riwayat Peminjaman</h1>
            <p className="text-stone-400 text-sm mt-1">{transactions.total ?? transactions.data.length} transaksi ditemukan</p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-stretch bg-white border border-stone-200 shadow-sm overflow-hidden w-full lg:max-w-xl rounded-xl">
            <div className="flex items-center flex-1 min-w-[200px] border-b md:border-b-0 md:border-r border-stone-200 px-3">
              <svg className="text-stone-300 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                name="search"
                defaultValue={filters?.search || ''}
                placeholder="Kode atau judul buku..."
                className="w-full px-3 py-3 bg-transparent outline-none border-none focus:ring-0 text-sm text-stone-900 placeholder-stone-300"
              />
            </div>
            <select name="status" defaultValue={filters?.status || ''} className="border-b md:border-b-0 md:border-r border-stone-200 px-3 py-3 bg-transparent text-stone-500 outline-none border-none focus:ring-0 text-xs font-semibold tracking-wider uppercase cursor-pointer min-w-[150px]">
              <option value="">Semua Status</option>
              <option value="pending_peminjaman">Pending Pinjam</option>
              <option value="dipinjam">Dipinjam</option>
              <option value="pending_pengembalian">Pending Kembali</option>
              <option value="dikembalikan">Dikembalikan</option>
              <option value="ditolak">Ditolak</option>
            </select>
            <button type="submit" className="bg-stone-900 text-[#f5f0e8] px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-amber-500 hover:text-stone-900 transition-colors whitespace-nowrap md:w-auto w-full">
              Cari
            </button>
          </form>
        </div>

        {/* CARDS FOR MOBILE / TABLE FOR DESKTOP */}
        <div className="bg-white border border-stone-200 shadow-sm overflow-hidden rounded-xl">
          {transactions.data.length > 0 ? (
            <>
              {/* Desktop Table View (Hidden on very small screens) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50/50">
                      {["Kode", "Buku", "Status", "Tgl. Pinjam", "Jatuh Tempo", "Denda", "Aksi"].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-[11px] font-bold text-stone-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {transactions.data.map((trx: any) => (
                      <tr key={trx.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs text-stone-500 whitespace-nowrap">{trx.kode_transaksi}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="shrink-0 w-10 h-14 rounded overflow-hidden shadow-sm bg-stone-100">
                              {trx.book.cover_image ? (
                                <img src={`/storage/${trx.book.cover_image}`} alt={trx.book.judul} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 text-lg">📖</div>
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-stone-900 line-clamp-2 text-sm">{trx.book.judul}</span>
                              <span className="text-stone-400 text-xs">{trx.book.penulis}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={trx.status} />
                        </td>
                        <td className="px-5 py-4 text-stone-500 text-xs whitespace-nowrap">
                          {trx.tanggal_pinjam ? new Date(trx.tanggal_pinjam).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-5 py-4 text-xs whitespace-nowrap">
                          {trx.tanggal_jatuh_tempo ? (
                            <span className={new Date(trx.tanggal_jatuh_tempo) < new Date() && trx.status === 'dipinjam' ? 'text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded' : 'text-stone-600'}>
                              {new Date(trx.tanggal_jatuh_tempo).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-5 py-4">
                          {trx.denda > 0 ? (
                            <div>
                              <span className="font-bold text-rose-600">Rp {trx.denda.toLocaleString('id-ID')}</span>
                              <span className={`block text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded inline-block ${trx.status_denda === 'lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {trx.status_denda === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {trx.status === 'dipinjam' && (
                            <Link
                              href={`/user/transactions/${trx.id}/return`}
                              method="post"
                              as="button"
                              className="inline-flex items-center gap-1.5 bg-stone-900 text-[#f5f0e8] px-4 py-2 text-xs font-bold tracking-wide uppercase rounded flex-shrink-0 hover:bg-amber-500 hover:text-stone-900 transition-colors whitespace-nowrap shadow-sm hover:shadow"
                            >
                              Kembalikan
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-stone-100">
                {transactions.data.map((trx: any) => (
                  <div key={trx.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs text-stone-500">{trx.kode_transaksi}</span>
                      <StatusBadge status={trx.status} />
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="shrink-0 w-16 h-24 rounded shadow-sm bg-stone-100 overflow-hidden">
                        {trx.book.cover_image ? (
                          <img src={`/storage/${trx.book.cover_image}`} alt={trx.book.judul} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400 text-2xl">📖</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-serif font-black text-stone-900 line-clamp-2 text-base leading-tight mb-1">{trx.book.judul}</span>
                        <span className="text-stone-500 text-xs mb-2">Penulis: {trx.book.penulis}</span>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mt-auto">
                          <div>
                            <p className="text-stone-400 capitalize text-[10px]">Tgl Pinjam</p>
                            <p className="font-medium text-stone-800">{trx.tanggal_pinjam ? new Date(trx.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}</p>
                          </div>
                          <div>
                            <p className="text-stone-400 capitalize text-[10px]">Jatuh Tempo</p>
                            <p className={`font-medium ${new Date(trx.tanggal_jatuh_tempo) < new Date() && trx.status === 'dipinjam' ? 'text-rose-600 font-bold' : 'text-stone-800'}`}>
                              {trx.tanggal_jatuh_tempo ? new Date(trx.tanggal_jatuh_tempo).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {(trx.denda > 0 || trx.status === 'dipinjam') && (
                      <div className={`mt-2 pt-3 border-t border-stone-100 flex items-center ${trx.denda > 0 ? 'justify-between' : 'justify-end'}`}>
                        {trx.denda > 0 && (
                          <div>
                            <span className="text-xs text-stone-500 block">Denda:</span>
                            <span className="font-bold text-rose-600 block">Rp {trx.denda.toLocaleString('id-ID')}</span>
                            <span className={`text-[10px] uppercase font-bold mt-0.5 ${trx.status_denda === 'lunas' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {trx.status_denda === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                            </span>
                          </div>
                        )}
                        {trx.status === 'dipinjam' && (
                          <Link
                            href={`/user/transactions/${trx.id}/return`}
                            method="post"
                            as="button"
                            className="bg-stone-900 text-[#f5f0e8] px-4 py-2.5 text-xs font-bold tracking-wide uppercase rounded-md hover:bg-amber-500 hover:text-stone-900 transition-colors shadow-sm"
                          >
                            Kembalikan Buku
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-3xl">📋</div>
              <div className="text-center">
                <p className="font-serif text-xl font-bold text-stone-900 mb-1">Riwayat Kosong</p>
                <p className="text-stone-500 text-sm">Belum ada transaksi peminjaman.</p>
              </div>
              <Link href="/user/books" className="mt-2 bg-stone-100 text-stone-800 font-medium px-4 py-2 rounded-lg text-sm hover:bg-stone-200 transition-colors">Jelajahi Katalog</Link>
            </div>
          )}

          {/* PAGINATION */}
          {transactions?.links && transactions.data.length > 0 && (
            <div className="flex flex-wrap items-center justify-center border-t border-stone-100 bg-[#f5f0e8]/30 p-2 md:p-4">
              <div className="flex flex-wrap items-center gap-1">
                {transactions.links.map((link: any, index: number) => (
                  <Link
                    key={index}
                    href={link.url || '#'}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-all rounded-md ${
                      link.active ? 'bg-stone-900 text-[#f5f0e8] shadow'
                        : 'bg-transparent text-stone-600 hover:bg-stone-200'
                    } ${!link.url ? 'opacity-30 pointer-events-none' : ''}`}
                    preserveState
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}