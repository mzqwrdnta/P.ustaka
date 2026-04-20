import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie, Legend } from 'recharts';
import { useState } from 'react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function Dashboard({ stats, charts, filters, options }: any) {
    const [month, setMonth] = useState(filters.month);
    const [year, setYear] = useState(filters.year);

    const handleFilterChange = (m: number, y: number) => {
        setMonth(m);
        setYear(y);
        router.get('/admin/dashboard', { month: m, year: y }, { preserveState: true, preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />
            
            <div className="flex flex-1 flex-col gap-6 p-6 min-w-0 bg-gray-50/50 dark:bg-zinc-950/50 min-h-screen">
                
                {/* PAGE HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Ringkasan Statistik</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Selamat datang kembali, berikut data perpustakaan hari ini.</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-lg border border-border/50 shadow-sm transition-all duration-300">
                        <select 
                            value={month} 
                            onChange={(e) => handleFilterChange(parseInt(e.target.value), year)}
                            className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer px-3 pr-8 py-1.5"
                        >
                            {Object.entries(options.months).map(([val, name]: any) => (
                                <option key={val} value={val}>{name}</option>
                            ))}
                        </select>
                        <div className="w-px h-4 bg-gray-200 dark:bg-zinc-700" />
                        <select 
                            value={year} 
                            onChange={(e) => handleFilterChange(month, parseInt(e.target.value))}
                            className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer px-3 pr-8 py-1.5"
                        >
                            {options.years.map((y: any) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {[
                        { label: 'Total Buku', val: stats.total_books, color: 'emerald', icon: 'B' },
                        { label: 'Total Anggota', val: stats.total_members, color: 'blue', icon: 'M' },
                        { label: 'Buku Dipinjam', val: stats.books_borrowed, color: 'indigo', icon: 'L' },
                        { label: 'Pending Pinjam', val: stats.pending_borrows, color: 'amber', icon: 'P' },
                        { label: 'Pending Kembali', val: stats.pending_returns, color: 'rose', icon: 'R' },
                        { label: 'Denda Aktif', val: `Rp ${stats.unpaid_fines.toLocaleString('id-ID')}`, color: 'rose', icon: 'D' },
                    ].map((s, i) => (
                        <div key={i} className="group relative overflow-hidden border-border/50 rounded-2xl border bg-white p-5 shadow-sm dark:bg-zinc-900 transition-all hover:shadow-md hover:-translate-y-1">
                            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${s.color}-500/5 rounded-full transition-all group-hover:scale-110`} />
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{s.label}</h3>
                            <p className={`text-2xl font-black tracking-tight ${s.color === 'rose' && i > 3 ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>
                                {s.val}
                            </p>
                        </div>
                    ))}
                </div>

                {/* TRANSACTIONS CHART */}
                <div className="border-border/50 rounded-3xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Tren Aktivitas Transaksi</h3>
                            <p className="text-xs text-gray-500">Jumlah peminjaman & pengembalian buku per hari.</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                Realtime
                             </div>
                        </div>
                    </div>
                    <div className="h-[350px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts.transactions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }} 
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }} 
                                />
                                <Tooltip 
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ 
                                        borderRadius: '16px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                                        fontSize: '11px',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                    itemStyle={{ padding: '2px 0' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="total" 
                                    stroke="#3b82f6" 
                                    fillOpacity={1} 
                                    fill="url(#colorTrend)" 
                                    strokeWidth={4} 
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* MEMBERS DISTRIBUTION */}
                    <div className="border-border/50 rounded-3xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <div className="mb-8">
                            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Distribusi Anggota</h3>
                            <p className="text-xs text-gray-500">Perbandingan jumlah anggota perpustakaan per kelas.</p>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.members} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 500 }} 
                                    />
                                    <Tooltip 
                                        cursor={{ fill: '#f3f4f6', opacity: 0.4 }}
                                        contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }} 
                                    />
                                    <Bar dataKey="total" radius={[8, 8, 8, 8]} barSize={28}>
                                        {charts.members.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* BOOKS BY CATEGORY */}
                    <div className="border-border/50 rounded-3xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
                        <div className="mb-8">
                            <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">Koleksi Kategori</h3>
                            <p className="text-xs text-gray-500">10 kategori buku dengan jumlah koleksi terbanyak.</p>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.books}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="total"
                                        stroke="none"
                                    >
                                        {charts.books.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                                        itemStyle={{ color: '#374151' }}
                                    />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36} 
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

