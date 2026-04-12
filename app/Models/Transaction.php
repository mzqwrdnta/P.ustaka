<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
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
}
