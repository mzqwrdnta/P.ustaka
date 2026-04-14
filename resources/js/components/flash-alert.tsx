import { useState, useEffect } from 'react';

interface FlashAlertProps {
    type: 'success' | 'error';
    message: string;
    duration?: number;
}

export default function FlashAlert({ type, message, duration = 4000 }: FlashAlertProps) {
    const [visible, setVisible] = useState(true);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFading(true), duration);
        const hideTimer = setTimeout(() => setVisible(false), duration + 500);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, [duration]);

    if (!visible) {
        return null;
    }

    const isSuccess = type === 'success';

    return (
        <div
            className={`mb-6 flex items-center gap-3 px-5 py-3.5 rounded-xl border text-sm font-bold shadow-sm transition-all duration-500 ${
                fading ? 'opacity-0 translate-y-[-10px]' : 'opacity-100 translate-y-0 animate-[fadeUp_0.3s_ease]'
            } ${
                isSuccess
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                    : 'bg-rose-50 text-rose-800 border-rose-100'
            }`}
        >
            <div
                className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                    isSuccess ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
            >
                {isSuccess ? '✓' : '✕'}
            </div>
            {message}
        </div>
    );
}
