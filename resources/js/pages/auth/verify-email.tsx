import { Head, useForm } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormEvent, useEffect, useState } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const [timer, setTimer] = useState(0);

    const { data, setData, post, processing: otpProcessing, errors } = useForm({
        otp: '',
    });

    const submitOtp = (e: FormEvent) => {
        e.preventDefault();
        post('/verify-otp');
    };

    const reSend = useForm();
    const handleResend = () => {
        if (timer > 0) return;
        reSend.post(send.url(), {
            onSuccess: () => setTimer(10),
        });
    };

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
            <Head title="Verifikasi Email (OTP)" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Kode OTP baru telah dikirim ke email Anda.
                </div>
            )}

            <form onSubmit={submitOtp} className="space-y-4">
                <div>
                    <Label htmlFor="otp">Masukkan Kode OTP</Label>
                    <Input
                        id="otp"
                        type="text"
                        name="otp"
                        value={data.otp}
                        className="mt-1 block w-full text-center tracking-widest text-lg"
                        onChange={(e: any) => setData('otp', e.target.value)}
                        required
                        autoFocus
                    />
                    {errors.otp && (
                        <div className="text-red-500 text-sm mt-1">{errors.otp}</div>
                    )}
                </div>

                <Button disabled={otpProcessing} type="submit" className="w-full">
                    {otpProcessing && <Spinner className="mr-2" />}
                    Verifikasi OTP
                </Button>
            </form>

            <div className="mt-6 flex flex-col items-center justify-center space-y-4">
                <Button 
                    disabled={reSend.processing || timer > 0} 
                    variant="secondary" 
                    onClick={handleResend}
                    className="w-full"
                >
                    {reSend.processing && <Spinner className="mr-2" />}
                    {timer > 0 ? `Tunggu ${timer} detik` : 'Kirim Ulang OTP'}
                </Button>

                <TextLink
                    href={logout()}
                    className="text-sm"
                >
                    Log out
                </TextLink>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifikasi Email',
    description:
        'Silakan masukkan kode OTP yang telah kami kirimkan ke email Anda untuk memverifikasi akun.',
};
