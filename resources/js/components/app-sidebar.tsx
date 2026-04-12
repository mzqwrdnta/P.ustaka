import { Link } from '@inertiajs/react';
import { BookOpen, BookUp, BookDown, FileBarChart, LayoutDashboard, Settings, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';
import type { NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Kelola Buku', href: '/admin/books', icon: BookOpen },
    { title: 'Kelola Anggota', href: '/admin/members', icon: Users },
    { title: 'Peminjaman', href: '/admin/transactions/borrows', icon: BookUp },
    { title: 'Pengembalian', href: '/admin/transactions/returns', icon: BookDown },
    { title: 'Laporan', href: '/admin/reports', icon: FileBarChart },
    { title: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

const userNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { title: 'Daftar Buku', href: '/user/books', icon: BookOpen },
    { title: 'Riwayat & Denda', href: '/user/transactions', icon: BookDown },
];

export function AppSidebar() {
    const page = usePage<any>();
    const role = page.props.auth?.user?.role || 'user';
    const navItems = role === 'admin' ? adminNavItems : userNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
