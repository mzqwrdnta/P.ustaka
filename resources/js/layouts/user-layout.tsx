import { Link, usePage } from '@inertiajs/react';
import { Home, Library, ScrollText, LogOut } from 'lucide-react';
import React from 'react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();

    const isPath = (path: string) => url.startsWith(path);

    const navItems = [
        { title: 'Katalog', href: '/user/books', icon: Library, active: isPath('/user/books') },
        { title: 'Transaksi', href: '/user/transactions', icon: ScrollText, active: isPath('/user/transactions') },
    ];

    return (
        <div className="min-h-screen bg-[#f5f0e8] text-stone-900 pb-24 md:pb-0 overflow-x-hidden relative">
            <style>{`.font-serif { font-family: 'Playfair Display', Georgia, serif; }`}</style>
            
            {/* DESKTOP NAV (Hidden on Mobile) */}
            <nav className="sticky top-0 z-50 bg-[#f5f0e8]/90 backdrop-blur-md border-b border-stone-200/80 hidden md:block">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
                    <div className="font-serif text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                        P<span className="text-amber-500">.</span>ustaka
                    </div>
                    <div className="flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link 
                                key={item.title} 
                                href={item.href} 
                                className={`px-4 py-2 text-sm font-medium rounded-sm transition-all flex items-center gap-2 ${item.active ? 'bg-stone-900 text-[#f5f0e8]' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.title}
                            </Link>
                        ))}
                        <div className="w-px h-5 bg-stone-300 mx-2" />
                        <Link method="post" href="/logout" as="button" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-500 hover:text-rose-600 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Keluar
                        </Link>
                    </div>
                </div>
            </nav>

            {/* MOBILE TOP BAR */}
            <nav className="sticky top-0 z-50 bg-[#f5f0e8]/90 backdrop-blur-md border-b border-stone-200/80 md:hidden flex items-center justify-between px-4 h-14">
                <div className="font-serif text-lg font-black text-stone-900 tracking-tight">
                    P<span className="text-amber-500">.</span>ustaka
                </div>
                <Link method="post" href="/logout" as="button" className="text-stone-500 hover:text-rose-600 p-2">
                    <LogOut className="w-5 h-5" />
                </Link>
            </nav>

            <main>
                {children}
            </main>

            {/* MOBILE FLOATING BOTTOM NAV */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[300px] z-50 md:hidden">
                <nav className="bg-white/80 backdrop-blur-xl border border-stone-200/50 shadow-2xl rounded-full px-2 py-1.5 flex justify-evenly items-center">
                    {navItems.map((item) => {
                        const isActive = item.active;
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`flex flex-col items-center justify-center min-w-[70px] space-y-1 transition-transform ${isActive ? 'text-stone-900 scale-105' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                                <div className={`relative p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-amber-100 text-amber-700 shadow-inner' : ''}`}>
                                    <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-[10px] tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
