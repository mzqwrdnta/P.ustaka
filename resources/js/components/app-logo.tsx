import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold text-gray-900 dark:text-white">
                    P.ustaka
                </span>
                <span className="truncate text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                    Perpustakaan Sekolah
                </span>
            </div>
        </>
    );
}
