<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OtpVerificationController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate(['otp' => 'required|string']);

        $user = $request->user();

        if ($user->otp === $request->otp && $user->otp_expires_at && $user->otp_expires_at->isFuture()) {
            $user->email_verified_at = now();
            $user->otp = null;
            $user->otp_expires_at = null;
            $user->save();

            return redirect()->route('dashboard')->with('success', 'Email berhasil diverifikasi.');
        }

        return back()->withErrors(['otp' => 'Kode OTP salah atau sudah kedaluwarsa.']);
    }

    public function resend(Request $request)
    {
        $user = $request->user();

        // Limit OTP request every 10 seconds - based on 5 min expiry, 4m 50s left means 10s passed
        if ($user->otp_expires_at && $user->otp_expires_at->subSeconds(290)->isFuture()) {
            $diff = $user->otp_expires_at->subSeconds(290)->diffInSeconds(now());

            return back()->with('status', "Silakan tunggu {$diff} detik sebelum meminta kode OTP kembali.");
        }

        $user->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
