<?php

namespace App\Models;

use App\Mail\SendOtpMail;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Mail;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'role', 'otp', 'otp_expires_at', 'provider', 'provider_id'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    public function generateOtp()
    {
        $this->otp = (string) rand(100000, 999999);
        $this->otp_expires_at = now()->addMinutes(5);
        $this->save();
    }

    public function sendEmailVerificationNotification()
    {
        // Throttle 10 seconds (5 mins - 10 secs = 4 mins 50 secs)
        if ($this->otp_expires_at && $this->otp_expires_at->subSeconds(290)->isFuture()) {
            return;
        }

        $this->generateOtp();
        Mail::to($this->email)->send(new SendOtpMail($this->otp, 'register'));
    }

    public function member()
    {
        return $this->hasOne(Member::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
