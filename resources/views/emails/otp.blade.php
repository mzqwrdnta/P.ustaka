<x-mail::message>
# Halo!

@if($purpose === 'register')
Terima kasih telah mendaftar di **{{ config('app.name') }}**. Silakan gunakan kode OTP berikut untuk memverifikasi alamat email Anda:
@else
Anda menerima email ini karena kami menerima permintaan pengaturan ulang password untuk akun Anda. Silakan gunakan kode OTP berikut untuk melanjutkan:
@endif

<x-mail::panel>
# {{ $otp }}
</x-mail::panel>

Kode ini akan kedaluwarsa dalam 10 menit. Jika Anda tidak merasa melakukan permintaan ini, silakan abaikan email ini.

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
