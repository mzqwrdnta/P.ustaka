import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#f5f0e8] p-6 md:p-10 text-stone-900">
            <style>{`.font-serif { font-family: 'Playfair Display', Georgia, serif; }`}</style>
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-black transition-transform hover:scale-110"
                        >
                             <div className="font-serif text-3xl font-black tracking-tight">
                                P<span className="text-amber-500">.</span>ustaka
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1 text-center">
                            <h1 className="text-2xl font-serif font-black">{title}</h1>
                            <p className="text-center text-xs text-stone-500 font-medium uppercase tracking-widest">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
