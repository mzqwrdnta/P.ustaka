<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected string $apiKey;

    protected string $adminPhone;

    public function __construct()
    {
        $this->apiKey = env('FONNTE_API_KEY', 'bwaeGDojCdMWohCaCfkD');
        $this->adminPhone = env('ADMIN_PHONE', '6289673626540');
    }

    public function sendMessage(string $target, string $message): bool
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->apiKey,
            ])->post('https://api.fonnte.com/send', [
                'target' => $target,
                'message' => $message,
                'countryCode' => '62',
            ]);

            if ($response->successful()) {
                return true;
            }

            Log::error('Fonnte API Error: '.$response->body());

            return false;
        } catch (\Exception $e) {
            Log::error('WhatsApp Service Exception: '.$e->getMessage());

            return false;
        }
    }

    public function notifyAdmin(string $message): bool
    {
        return $this->sendMessage($this->adminPhone, $message);
    }
}
