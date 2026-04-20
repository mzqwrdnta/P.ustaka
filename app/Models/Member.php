<?php

namespace App\Models;

use Database\Factories\MemberFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    /** @use HasFactory<MemberFactory> */
    use HasFactory;

    protected $guarded = [];

    public static function getUniqueKelas()
    {
        return self::query()
            ->select('kelas')
            ->whereNotNull('kelas')
            ->where('kelas', '!=', '')
            ->pluck('kelas')
            ->map(fn ($kelas) => trim(str_replace('-', ' ', $kelas)))
            ->unique()
            ->sort()
            ->values();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
