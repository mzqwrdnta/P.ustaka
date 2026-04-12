import { Head, Link, router, usePage, usePoll } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Filter, X, Zap, BookOpen, Clock, Info } from 'lucide-react';
import UserLayout from '@/layouts/user-layout';

function BookCover({ book }: { book: any }) {
  return (
    <div className="relative w-full aspect-[2/3] rounded shadow-sm bg-stone-200 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[5%] bg-black/10 z-10" />
      {book.cover_image ? (
        <img src={`/storage/${book.cover_image}`} alt={book.judul} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 bg-stone-50">
          <span className="text-3xl sm:text-5xl opacity-10 mb-2">📚</span>
          <p className="text-stone-400 font-serif text-[10px] sm:text-xs font-bold text-center leading-tight mb-1">{book.judul}</p>
        </div>
      )}
    </div>
  );
}

function BookCard({ book, delay, onView }: { book: any; delay: number; onView: () => void }) {
  const isOutOfStock = book.stok <= 0;
  
  return (
    <div className={`cursor-pointer group flex flex-col transition-all duration-300 ${isOutOfStock ? 'opacity-70 grayscale-[0.5]' : ''}`} style={{ animation: `fadeUp 0.5s ${delay}s both` }}>
      <div onClick={onView} className="relative mb-3 transition-transform duration-300 md:group-hover:-translate-y-1.5 overflow-hidden rounded shadow-md group-hover:shadow-xl">
        <BookCover book={book} />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
            <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-lg">Habis</span>
            <span className="text-white/60 text-[8px] uppercase mt-1">Stok Kosong</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
             <span className="text-white text-xs font-bold flex items-center gap-1">Lihat Detail <Info className="w-3 h-3"/></span>
        </div>
      </div>
      <div className="flex-1 flex flex-col px-1">
        <p className="text-[10px] text-amber-600 font-black tracking-widest uppercase mb-1 line-clamp-1">{book.kategori}</p>
        <h3 className="font-serif text-stone-900 text-sm sm:text-base font-black leading-tight mb-1 line-clamp-2 transition-colors group-hover:text-amber-700">{book.judul}</h3>
        <p className="text-stone-500 text-[11px] sm:text-xs line-clamp-1 mb-2">Oleh {book.penulis}</p>
        
        {!isOutOfStock && (
             <div className="flex items-center gap-2 mt-auto pt-2 border-t border-stone-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">{book.stok} Buku Tersedia</span>
             </div>
        )}
      </div>
    </div>
  );
}

export default function BooksIndex({ books, categories = [], filters }: any) {
    const { flash } = usePage<any>().props;
    const [selectedBook, setSelectedBook] = useState<any>(null);

    usePoll(5000, { only: ['books'] });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        router.get('/user/books', { 
            search: formData.get('search'), 
            kategori: formData.get('kategori')
        }, { preserveState: true });
    };

    const handleCategorySelect = (cat: string) => {
        router.get('/user/books', { 
            search: filters?.search || '', 
            kategori: filters?.kategori === cat ? '' : cat 
        }, { preserveState: true });
    };

    const handleBorrow = (book: any) => {
        router.post(`/user/books/${book.id}/borrow`, {}, {
            preserveScroll: true,
            onSuccess: () => setSelectedBook(null)
        });
    };

    return (
        <UserLayout>
            <Head title="Katalog Buku" />
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { transform: translateY(100%); }
                    to   { transform: translateY(0); }
                }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); }
            `}</style>
            
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* AESTHETIC SEARCH BAR - NO HERO */}
                <div className="flex flex-col items-center mb-12 animate-[fadeUp_0.6s_ease_both]">
                    <div className="text-center mb-10">
                         <h1 className="font-serif text-3xl md:text-5xl font-black text-stone-900 mb-2">Katalog Pustaka</h1>
                         <p className="text-stone-400 text-sm md:text-base font-light italic">"Buku adalah jendela dunia, jelajahi tanpa batas."</p>
                    </div>

                    <form onSubmit={handleSearch} className="w-full max-w-2xl group flex bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-stone-200/60 p-1.5 focus-within:border-amber-500 focus-within:shadow-[0_15px_50px_-12px_rgba(245,158,11,0.15)] transition-all">
                        <div className="flex-1 flex items-center px-4 py-2 border-r border-stone-100">
                            <Search className="w-5 h-5 text-stone-400 mr-3 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                                name="search" 
                                defaultValue={filters?.search || ''} 
                                placeholder="Cari buku, pengarang, atau topik..." 
                                className="w-full bg-transparent border-0 outline-none focus:ring-0 p-2 text-stone-900 text-sm md:text-base placeholder-stone-400 font-medium" 
                            />
                            <input type="hidden" name="kategori" value={filters?.kategori || ''} />
                        </div>
                        <button type="submit" className="bg-stone-900 text-white rounded-[14px] px-8 py-3 text-sm font-black tracking-widest hover:bg-amber-500 hover:text-stone-900 transition-all uppercase active:scale-95">
                            Cari
                        </button>
                    </form>
                </div>

                {flash?.success && (
                    <div className="mb-8 flex items-center gap-3 bg-emerald-50 text-emerald-800 px-5 py-4 rounded-xl border border-emerald-100 text-sm font-bold shadow-sm animate-[fadeUp_0.3s_ease]">
                        <div className="bg-emerald-500 text-white rounded-full p-1"><X className="w-3 h-3 rotate-45" /></div>
                        {flash.success}
                    </div>
                )}

                {/* CATEGORIES */}
                <div className="mb-10">
                    <div className="flex overflow-x-auto hide-scrollbar gap-2.5 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                        <button 
                            onClick={() => handleCategorySelect('')}
                            className={`shrink-0 px-6 py-2.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase transition-all border ${!filters?.kategori ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-900/10' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}
                        >
                            Semua
                        </button>
                        {categories.map((cat: string) => (
                            <button 
                                key={cat}
                                onClick={() => handleCategorySelect(cat)}
                                className={`shrink-0 px-6 py-2.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase transition-all border ${filters?.kategori === cat ? 'bg-stone-900 text-white border-stone-900 shadow-lg shadow-stone-900/10' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID - Sorted on server (UserController index) */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 gap-y-12">
                    {books.data.map((book: any, idx: number) => (
                        <BookCard key={book.id} book={book} delay={(idx % 12) * 0.04} onView={() => setSelectedBook(book)} />
                    ))}
                </div>

                {books.data.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
                        <BookOpen className="w-16 h-16 mb-6 stroke-1 text-stone-300" />
                        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">Pustaka Kosong</h3>
                        <p className="text-stone-500 max-w-xs mx-auto">Tidak ada buku yang sesuai dengan pencarian Anda.</p>
                    </div>
                )}

                {/* PAGINATION */}
                {books?.links && books.data.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-12 mt-12 border-t border-stone-100">
                        {books.links.map((link: any, index: number) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all rounded-lg border ${
                                    link.active ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-900'
                                } ${!link.url ? 'opacity-20 pointer-events-none' : ''}`}
                                preserveState
                                preserveScroll
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* UPGRADED POPUP DETAIL */}
            {selectedBook && (
              <div className="fixed inset-0 z-[100] flex md:items-center justify-center bg-stone-900/70 backdrop-blur-md transition-all p-0 md:p-6" onClick={() => setSelectedBook(null)}>
                <div 
                  className="bg-[#f5f0e8] w-full max-w-4xl md:rounded-3xl flex flex-col md:flex-row mt-auto md:mt-0 md:h-auto h-[92vh] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both] md:animate-[fadeUp_0.3s_ease_both]" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => setSelectedBook(null)} className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur hover:bg-white/40 rounded-full text-stone-900 transition-all border border-white/20">
                    <X className="w-5 h-5" />
                  </button>
                  
                  {/* Left Side: Visual */}
                  <div className="md:w-5/12 shrink-0 bg-stone-300 relative flex items-center justify-center p-12 md:p-16 border-r border-stone-200/50">
                    <div className="absolute inset-0 overflow-hidden opacity-30 blur-2xl grayscale">
                        {selectedBook.cover_image && <img src={`/storage/${selectedBook.cover_image}`} className="w-full h-full object-cover scale-125" alt="" />}
                    </div>
                    <div className="relative z-10 w-full transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                        <BookCover book={selectedBook} />
                        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-xl border-8 border-[#f5f0e8] transform rotate-12">
                             <Clock className="w-8 h-8 text-stone-900" />
                        </div>
                    </div>
                  </div>
                  
                  {/* Right Side: Content */}
                  <div className="p-8 md:p-14 flex-1 flex flex-col overflow-y-auto">
                    <div className="mb-6 flex items-center gap-3">
                        <span className="text-[10px] bg-stone-900 text-white px-3 py-1 rounded-full uppercase font-black tracking-[0.2em]">{selectedBook.kategori}</span>
                        {selectedBook.stok > 0 ? (
                             <span className="text-[10px] text-emerald-600 font-black uppercase flex items-center gap-1 leading-none"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Tersedia</span>
                        ) : (
                             <span className="text-[10px] text-rose-600 font-black uppercase flex items-center gap-1 leading-none"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div> Habis</span>
                        )}
                    </div>

                    <h2 className="font-serif text-3xl md:text-5xl font-black leading-tight text-stone-900 mb-2">{selectedBook.judul}</h2>
                    <p className="text-stone-500 text-sm md:text-lg mb-8 italic">Oleh <span className="text-stone-900 font-bold not-italic">{selectedBook.penulis}</span></p>
                    
                    <div className="mb-10 space-y-3">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-400">Sinopsis Buku</h4>
                      <p className="text-stone-700 text-sm md:text-base leading-relaxed font-medium">
                        {selectedBook.deskripsi || "Tidak ada deskripsi rinci untuk buku ini. Silakan hubungi petugas perpustakaan untuk informasi selengkapnya."}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-6 border-t border-stone-200">
                      <button 
                        onClick={() => handleBorrow(selectedBook)}
                        disabled={selectedBook.stok <= 0}
                        className={`w-full sm:flex-1 py-4.5 md:py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl
                            ${selectedBook.stok > 0 
                                ? 'bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-900 hover:scale-[1.02] shadow-stone-900/20' 
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'}`}
                      >
                        {selectedBook.stok > 0 ? "Pinjam Sekarang" : "Stok Tidak Tersedia"}
                      </button>
                      
                      {selectedBook.stok > 0 && (
                          <div className="flex flex-col items-center shrink-0">
                             <span className="text-2xl font-black text-stone-900">{selectedBook.stok}</span>
                             <span className="text-[9px] font-black uppercase text-stone-400 tracking-tighter">Sisa Salinan</span>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </UserLayout>
    );
}
