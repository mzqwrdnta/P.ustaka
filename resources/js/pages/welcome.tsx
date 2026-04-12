import { Head, Link, usePage, router } from '@inertiajs/react';
import { login, register } from '@/routes';
import { useState, useEffect } from "react";
import { Search, Compass, BookOpen, ChevronRight, X, Info } from 'lucide-react';

function BookCover({ book }: { book: any }) {
    return (
      <div className="relative w-full aspect-[2/3] rounded overflow-hidden shadow-md bg-stone-200">
        <div className="absolute left-0 top-0 bottom-0 w-[5%] bg-black/15 z-10" />
        {book.cover_image ? (
          <img src={`/storage/${book.cover_image}`} alt={book.judul} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 bg-stone-100">
            <span className="text-3xl sm:text-5xl opacity-20 mb-2">📚</span>
            <p className="text-stone-600 font-serif text-[10px] sm:text-xs font-bold text-center leading-tight mb-1">{book.judul}</p>
          </div>
        )}
      </div>
    );
}

function BookCard({ book, delay, onView }: { book: any; delay: number; onView: () => void }) {
    const isOutOfStock = book.stok <= 0;
    return (
      <div className={`cursor-pointer group flex flex-col transition-all duration-300 ${isOutOfStock ? 'opacity-60 grayscale-[0.3]' : ''}`} style={{ animation: `fadeUp 0.5s ${delay}s both` }}>
        <div onClick={onView} className="relative mb-3 transition-transform duration-300 md:group-hover:-translate-y-2 group-hover:shadow-2xl">
          <BookCover book={book} />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] rounded flex items-center justify-center z-20">
              <span className="bg-rose-600 text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full">Habis</span>
            </div>
          )}
          <div className="absolute inset-0 bg-stone-900/0 md:group-hover:bg-stone-900/20 transition-colors flex items-center justify-center">
             <Info className="text-white opacity-0 md:group-hover:opacity-100 transition-opacity w-8 h-8" />
          </div>
        </div>
        <div className="flex-1 flex flex-col px-1">
          <p className="text-[10px] text-amber-600 font-black tracking-widest uppercase mb-1 line-clamp-1">{book.kategori}</p>
          <h3 className="font-serif text-stone-900 text-sm md:text-base font-black leading-tight mb-1 line-clamp-2 group-hover:text-amber-700 transition-colors">{book.judul}</h3>
          <p className="text-stone-500 text-[11px] md:text-xs line-clamp-1">Oleh {book.penulis}</p>
        </div>
      </div>
    );
}

export default function Welcome({ canRegister = true, dbBooks = [], dbCategories = [], filters = {} }: any) {
    const { auth } = usePage().props as { auth: { user: unknown } };
    const [activeFilter, setActiveFilter] = useState(filters.kategori || "");
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const [selectedBook, setSelectedBook] = useState<any>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (activeFilter !== "" || searchValue !== "" || window.location.search !== "") {
                router.get('/', { search: searchValue, kategori: activeFilter }, { preserveState: true, replace: true, preserveScroll: true });
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchValue, activeFilter]);

    const handleBorrow = (book: any) => {
        if (!auth.user) {
            router.get(login());
        } else {
            router.post(`/user/books/${book.id}/borrow`, {}, {
                preserveScroll: true,
                onSuccess: () => setSelectedBook(null),
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f0e8] text-stone-900 selection:bg-amber-500/30">
            <Head>
                <title>P.ustaka | Jelajahi Dunia Lewat Buku</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&display=swap" rel="stylesheet" />
            </Head>

            <style>{`
                .font-serif { font-family: 'Playfair Display', Georgia, serif; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(100%); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .anim-fade { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-white/70 backdrop-blur-md border-b border-stone-200">
                <div className="font-serif text-xl md:text-2xl font-black text-stone-900 tracking-tight">
                    P<span className="text-amber-500">.</span>ustaka
                </div>
                
                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link href="/user/books" className="bg-stone-900 text-white text-xs md:text-sm font-bold px-6 py-2.5 rounded-full hover:bg-amber-500 hover:text-stone-900 transition-all shadow-lg">
                            Ke Katalog
                        </Link>
                    ) : (
                        <>
                            <Link href={login()} className="text-stone-500 text-xs md:text-sm font-medium hover:text-stone-900 transition-colors">
                                Masuk
                            </Link>
                            {canRegister && (
                                <Link href={register()} className="bg-stone-900 text-white text-xs md:text-sm font-bold px-6 py-2.5 rounded-full hover:bg-amber-500 hover:text-stone-900 transition-all shadow-lg">
                                    Daftar
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </nav>

            {/* AESTHETIC SEARCH SECTION - REPLACE HERO */}
            <section className="pt-32 pb-16 px-6 text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center">
                    <span className="anim-fade relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/5 border border-stone-200 text-[10px] font-black uppercase tracking-widest text-amber-600 mb-6" style={{ animationDelay: '0.1s' }}>
                        <Compass className="w-3.5 h-3.5" /> Jendela Literasi Digital
                    </span>

                    <h1 className="anim-fade font-serif text-[clamp(2rem,6vw,4rem)] font-black leading-tight text-stone-900 mb-8" style={{ animationDelay: '0.2s' }}>
                        Temukan Inspirasi <br className="hidden md:block" />
                        Dalam Setiap <span className="text-amber-500 italic">Halaman.</span>
                    </h1>

                    {/* Premium Centered Search Bar */}
                    <div className="anim-fade w-full max-w-2xl" style={{ animationDelay: '0.3s' }}>
                        <div className="flex flex-col sm:flex-row items-center bg-white border border-stone-200 p-1.5 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] focus-within:ring-4 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
                            <div className="flex-1 flex items-center px-4 py-2 sm:py-0 w-full">
                                <Search className="w-5 h-5 text-stone-400 mr-3 shrink-0" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Cari judul buku, penulis, atau topik..."
                                    className="w-full py-3 text-sm md:text-base text-stone-900 bg-transparent border-none focus:ring-0 placeholder:text-stone-400 font-medium"
                                />
                            </div>
                            <button className="w-full sm:w-auto bg-stone-900 text-white px-8 py-3.5 sm:py-3.5 rounded-xl text-[11px] font-black tracking-widest hover:bg-amber-500 hover:text-stone-900 transition-all uppercase">
                                Cari
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CATALOG - DIRECTLY BELOW SEARCH */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-black text-stone-900">Koleksi Kami</h2>
                        <p className="text-stone-400 text-sm mt-1">Jelajahi ribuan referensi terbaik untuk Anda.</p>
                    </div>
                    
                    <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                        <button 
                            onClick={() => setActiveFilter('')}
                            className={`shrink-0 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border ${activeFilter === '' ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}
                        >
                            Semua
                        </button>
                        {dbCategories.map((c: string) => (
                            <button 
                                key={c}
                                onClick={() => setActiveFilter(c)}
                                className={`shrink-0 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all border ${activeFilter === c ? 'bg-stone-900 text-white border-stone-900 shadow-md' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 gap-y-12 min-h-[40vh]">
                    {dbBooks.length > 0 ? dbBooks.map((book: any, i: number) => (
                        <BookCard key={book.id} book={book} delay={(i % 12) * 0.04} onView={() => setSelectedBook(book)} />
                    )) : (
                        <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-2xl text-stone-300 mb-4">🔍</div>
                            <h3 className="font-serif text-xl font-bold text-stone-900">Buku Tidak Ditemukan</h3>
                            <p className="text-stone-400 text-sm">Coba kata kunci lain.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* FOOTER - CLEANER */}
            <footer className="bg-stone-900 text-stone-400 px-6 py-12 mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="font-serif text-2xl font-black text-white">
                        P<span className="text-amber-500">.</span>ustaka
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <p className="text-xs font-medium uppercase tracking-widest">Digital Library Experience</p>
                        <p className="text-[10px]">© 2026 P.ustaka Digital. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* MODAL DETAIL */}
            {selectedBook && (
              <div 
                className="fixed inset-0 z-[100] flex md:items-center justify-center bg-stone-900/70 backdrop-blur-sm transition-opacity p-0 md:p-6"
                onClick={() => setSelectedBook(null)}
              >
                <div 
                  className="bg-[#f5f0e8] text-stone-900 shadow-2xl w-full max-w-4xl md:rounded-3xl flex flex-col md:flex-row mt-auto md:mt-0 md:max-h-[85vh] h-[90vh] md:h-auto overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => setSelectedBook(null)} className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white rounded-full text-stone-900 transition-all border border-white/20">
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="md:w-5/12 shrink-0 bg-stone-300 relative flex items-center justify-center p-12 md:p-16 border-r border-stone-200">
                    <div className="relative z-10 w-full transform -rotate-1">
                        <BookCover book={selectedBook} />
                    </div>
                  </div>
                  
                  <div className="p-8 md:p-14 flex-1 flex flex-col overflow-y-auto">
                    <div className="mb-4">
                        <span className="text-[10px] bg-stone-900 text-white px-3 py-1 rounded-full uppercase font-black tracking-widest">{selectedBook.kategori}</span>
                    </div>

                    <h2 className="font-serif text-2xl md:text-4xl font-black leading-tight text-stone-900 mb-2">{selectedBook.judul}</h2>
                    <p className="text-stone-500 font-bold text-sm md:text-base mb-8 border-b border-stone-200 pb-4">Penulis: <span className="text-stone-900">{selectedBook.penulis}</span></p>
                    
                    <div className="mb-8 flex-1">
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-400 mb-2">Sinopsis</h4>
                      <p className="text-stone-800 text-sm md:text-base leading-relaxed">
                        {selectedBook.deskripsi || "Tidak ada deskripsi rinci untuk buku ini."}
                      </p>
                    </div>
                    
                    <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center gap-6 border-t border-stone-200">
                      <button 
                        onClick={() => handleBorrow(selectedBook)}
                        disabled={selectedBook.stok <= 0}
                        className={`w-full sm:flex-1 py-4 font-black tracking-widest uppercase text-xs rounded-xl transition-all shadow-lg
                            ${selectedBook.stok > 0 
                                ? 'bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-900' 
                                : 'bg-stone-200 text-stone-300 cursor-not-allowed shadow-none'}`}
                      >
                        {selectedBook.stok > 0 ? "Ajukan Peminjaman" : "Stok Habis"}
                      </button>
                      <div className="text-center px-2 shrink-0">
                        <span className="block text-2xl font-black text-stone-900 leading-none">{selectedBook.stok}</span>
                        <span className="block text-[9px] font-black uppercase text-stone-400 mt-1 uppercase tracking-tighter">Sisa Stok</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
}