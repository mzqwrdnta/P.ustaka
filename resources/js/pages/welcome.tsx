import { Head, Link, usePage, router } from '@inertiajs/react';
import { login, register } from '@/routes';
import { useState, useEffect } from "react";
import { Search, Compass, BookOpen, ChevronRight, X, Info } from 'lucide-react';
import FlashAlert from '@/components/flash-alert';

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
    const { auth, flash } = usePage().props as any;
    const [activeFilter, setActiveFilter] = useState(filters.kategori || "");
    const [searchValue, setSearchValue] = useState(filters.search || "");
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [isBorrowing, setIsBorrowing] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);

    // Auto-reopen modal when backend returns an error for a specific book
    useEffect(() => {
        if (flash?.error_book_id && flash?.error) {
            const book = dbBooks.find((b: any) => b.id === flash.error_book_id);
            if (book) {
                setSelectedBook(book);
                setModalError(flash.error);
            }
        }
    }, [flash?.error_book_id, flash?.error]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            const hasChanged = searchValue !== (filters.search || "") || activeFilter !== (filters.kategori || "");
            if (hasChanged) {
                router.get('/', { search: searchValue, kategori: activeFilter }, { preserveState: true, replace: true, preserveScroll: true });
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchValue, activeFilter]);

    const handleBorrow = (book: any) => {
        if (!auth.user) {
            router.get(login());
        } else {
            setIsBorrowing(true);
            setModalError(null);
            router.post(`/user/books/${book.id}/borrow`, {}, {
                preserveScroll: true,
                onFinish: () => setIsBorrowing(false),
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
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .anim-fade { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .anim-float { animation: float 6s ease-in-out infinite; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .pattern-dots {
                    background-image: radial-gradient(rgba(0,0,0,0.05) 1.5px, transparent 1.5px);
                    background-size: 24px 24px;
                }
                .pattern-grid {
                    background-image: linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
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
            <section className="pt-32 pb-16 px-6 text-center relative overflow-hidden pattern-dots">
                <div className="absolute top-20 left-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl anim-float" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-stone-900/5 rounded-full blur-2xl anim-float" style={{ animationDelay: '1s' }} />
                
                <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
                    {flash?.success && <FlashAlert type="success" message={flash.success} />}
                    {flash?.error && <FlashAlert type="error" message={flash.error} />}
                    
                    <span className="anim-fade relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-[10px] font-black uppercase tracking-widest text-amber-600 mb-6 shadow-sm" style={{ animationDelay: '0.1s' }}>
                        <Compass className="w-3.5 h-3.5" /> Jendela Literasi Digital
                    </span>

                    <h1 className="anim-fade font-serif text-[clamp(2rem,6vw,4rem)] font-black leading-tight text-stone-900 mb-8" style={{ animationDelay: '0.2s' }}>
                        Temukan Inspirasi <br className="hidden md:block" />
                        Dalam Setiap <span className="text-amber-500 italic relative">
                            Halaman.
                            <svg className="absolute -bottom-2 left-0 w-full h-2 text-amber-300/60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                            </svg>
                        </span>
                    </h1>

                    {/* Premium Centered Search Bar */}
                    <div className="anim-fade w-full max-w-2xl" style={{ animationDelay: '0.3s' }}>
                        <div className="flex flex-col sm:flex-row items-center bg-white border border-stone-200 p-1.5 rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] focus-within:ring-4 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all">
                            <div className="flex-1 flex items-center px-4 py-2 sm:py-0 w-full">
                                <Search className="w-5 h-5 text-stone-400 mr-3 shrink-0" />
                                <input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="Cari judul buku, penulis, atau topik..."
                                    className="w-full py-3 text-sm md:text-base text-stone-900 bg-transparent border-none focus:ring-0 placeholder:text-stone-400 font-medium"
                                />
                                {searchValue && (
                                    <button 
                                        type="button"
                                        onClick={() => setSearchValue('')}
                                        className="p-1.5 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors mr-2"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button className="w-full sm:w-auto bg-stone-900 text-white px-8 py-3.5 sm:py-3.5 rounded-xl text-[11px] font-black tracking-widest hover:bg-amber-500 hover:text-stone-900 transition-all uppercase shadow-md active:scale-95">
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
            <footer className="bg-stone-900 text-stone-400 px-6 py-12 mt-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-stone-700 to-amber-500" />
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative z-10">
                    <div className="font-serif text-2xl font-black text-white">
                        P<span className="text-amber-500">.</span>ustaka
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-2">
                        <p className="text-xs font-medium uppercase tracking-widest text-amber-500/80">Digital Library Experience</p>
                        <p className="text-[10px]">© 2026 P.ustaka Digital. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* MODAL DETAIL */}
            {selectedBook && (
              <div 
                className="fixed inset-0 z-[100] flex md:items-center justify-center bg-stone-900/70 backdrop-blur-sm transition-opacity p-0 md:p-6"
                onClick={() => { setSelectedBook(null); setModalError(null); }}
              >
                <div 
                  className="bg-[#f5f0e8] text-stone-900 shadow-2xl w-full max-w-4xl md:rounded-3xl flex flex-col md:flex-row mt-auto md:mt-0 md:max-h-[85vh] h-[90vh] md:h-auto overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)_both]" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => { setSelectedBook(null); setModalError(null); }} className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white rounded-full text-stone-900 transition-all border border-white/20">
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="md:w-5/12 shrink-0 bg-stone-300 relative flex items-center justify-center p-8 md:p-16 border-b md:border-b-0 md:border-r border-stone-200 min-h-[250px] md:min-h-0">
                    <div className="absolute inset-0 overflow-hidden opacity-30 blur-2xl grayscale">
                        {selectedBook.cover_image && <img src={`/storage/${selectedBook.cover_image}`} className="w-full h-full object-cover scale-150" alt="" />}
                    </div>
                    <div className="relative z-10 w-32 sm:w-40 md:w-full transform -rotate-2 md:-rotate-1 shadow-2xl">
                        <BookCover book={selectedBook} />
                        {selectedBook.stok > 0 && (
                             <div className="md:hidden absolute -bottom-4 -right-4 w-14 h-14 bg-amber-500 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-[#f5f0e8] transform rotate-12 text-stone-900 leading-none">
                                 <span className="text-[10px] font-black uppercase tracking-tighter mix-blend-color-burn opacity-70">Sisa</span>
                                 <span className="text-xl font-black mt-0.5">{selectedBook.stok}</span>
                             </div>
                        )}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 md:p-14 flex-1 overflow-y-auto hide-scrollbar">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-[10px] bg-stone-900 text-white px-3 py-1 rounded-full uppercase font-black tracking-widest">{selectedBook.kategori}</span>
                        </div>

                        {modalError && <FlashAlert type="error" message={modalError} duration={5000} />}

                        <h2 className="font-serif text-2xl md:text-4xl font-black leading-tight text-stone-900 mb-2">{selectedBook.judul}</h2>
                        <p className="text-stone-500 font-bold text-sm md:text-base mb-8 border-b border-stone-200 pb-4">Penulis: <span className="text-stone-900">{selectedBook.penulis}</span></p>
                        
                        <div className="pb-4">
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-stone-400 mb-2">Sinopsis</h4>
                          <p className="text-stone-800 text-sm md:text-base leading-relaxed">
                            {selectedBook.deskripsi || "Tidak ada deskripsi rinci untuk buku ini."}
                          </p>
                        </div>
                    </div>
                    
                    {/* FIXED ACTION BAR */}
                    <div className="p-4 md:px-14 md:py-6 bg-[#f0eae1] border-t border-stone-200 flex items-center gap-6 shrink-0 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                      <button 
                        onClick={() => handleBorrow(selectedBook)}
                        disabled={selectedBook.stok <= 0 || isBorrowing}
                        className={`w-full md:flex-1 py-4 font-black tracking-widest uppercase text-xs md:text-sm rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
                            ${selectedBook.stok > 0 && !isBorrowing
                                ? 'bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-900' 
                                : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'}`}
                      >
                        {isBorrowing && <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />}
                        {selectedBook.stok > 0 ? (isBorrowing ? "Memproses..." : "Ajukan Peminjaman") : "Stok Habis"}
                      </button>
                      
                      {/* DESKTOP STOCK */}
                      {selectedBook.stok > 0 && (
                          <div className="hidden md:block text-center px-4 shrink-0">
                            <span className="block text-3xl font-black text-stone-900 leading-none">{selectedBook.stok}</span>
                            <span className="block text-[10px] font-black uppercase text-stone-400 mt-1 uppercase tracking-widest">Sisa Stok</span>
                          </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
}