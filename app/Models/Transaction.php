<?php

namespace App\Models;

use Carbon\Carbon;
use Database\Factories\TransactionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /** @use HasFactory<TransactionFactory> */
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'tanggal_pinjam' => 'date',
        'tanggal_jatuh_tempo' => 'date',
        'tanggal_pengajuan_kembali' => 'date',
        'tanggal_kembali' => 'date',
    ];

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public static function syncFines()
    {
        $dendaPerHari = Setting::where('key', 'denda_per_hari')->value('value') ?? 2000;

        $overdueTransactions = self::where('status', 'dipinjam')
            ->whereNotNull('tanggal_jatuh_tempo')
            ->where('tanggal_jatuh_tempo', '<', now()->startOfDay())
            ->get();

        /** @var Transaction $trx */
        foreach ($overdueTransactions as $trx) {
            $hariTerlambat = abs((int) now()->startOfDay()->diffInDays(Carbon::parse($trx->tanggal_jatuh_tempo)->startOfDay(), false));
            $denda = $hariTerlambat * (int) $dendaPerHari;

            $trx->hari_terlambat = $hariTerlambat;
            $trx->denda = $denda;
            $trx->status_denda = ($trx->denda_dibayar >= $denda && $denda > 0) ? 'lunas' : 'belum_bayar';
            $trx->save();
        }
    }
}
