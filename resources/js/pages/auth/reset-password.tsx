import { Head, useForm, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';

type Props = {
    email: string;
    status?: string;
};

export default function ResetPassword({ email, status }: Props) {
    const [timer, setTimer] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        email: email || '',
        otp: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    return (
        <>
            <Head title="Reset password" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    post('/reset-password-otp');
                }}
            >
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="mt-1 block w-full bg-stone-100"
                            readOnly
                        />
                        <InputError
                            message={errors.email}
                            className="mt-2"
                        />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="otp">Kode OTP</Label>
                            <Button
                                type="button"
                                variant="link"
                                disabled={timer > 0}
                                className="h-auto p-0 text-xs font-semibold uppercase tracking-wider text-amber-600 hover:text-amber-700 decoration-stone-300 disabled:text-stone-400"
                                onClick={() => {
                                    if (timer > 0) return;
                                    router.post('/forgot-password-otp', { email: data.email }, {
                                        preserveScroll: true,
                                        onSuccess: () => setTimer(10),
                                    });
                                }}
                            >
                                {timer > 0 ? `Tunggu ${timer}s` : 'Kirim Ulang OTP'}
                            </Button>
                        </div>
                        <Input
                            id="otp"
                            type="text"
                            name="otp"
                            autoComplete="off"
                            className="mt-1 block w-full text-center tracking-[0.5em] font-bold text-lg"
                            autoFocus
                            placeholder="6 DIGIT KODE DARI EMAIL"
                            value={data.otp}
                            onChange={(e) => setData('otp', e.target.value)}
                            maxLength={6}
                        />
                        <InputError message={errors.otp} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password Baru</Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            className="mt-1 block w-full"
                            placeholder="Password Baru"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Konfirmasi Password
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            autoComplete="new-password"
                            className="mt-1 block w-full"
                            placeholder="Confirm password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        disabled={processing}
                        data-test="reset-password-button"
                    >
                        {processing && <Spinner />}
                        Ubah Password
                    </Button>
                </div>
            </form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below',
};
