<?php

namespace Database\Seeders;

use App\Models\Transaction;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        // Seeding a few representative transactions
        $transactions = [
            [
                'kode_transaksi' => 'TRX-1712614231-3',
                'member_id' => 1,
                'book_id' => 3,
                'status' => 'dipinjam',
                'tanggal_pinjam' => '2026-04-09 00:00:00',
                'tanggal_jatuh_tempo' => '2026-04-10 00:00:00',
            ],
            [
                'kode_transaksi' => 'TRX-1713183594-3',
                'member_id' => 1,
                'book_id' => 5,
                'status' => 'dikembalikan',
                'tanggal_pinjam' => '2026-04-15 00:00:00',
                'tanggal_jatuh_tempo' => '2026-04-16 00:00:00',
                'tanggal_kembali' => '2026-04-16 10:33:34',
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::updateOrCreate(['kode_transaksi' => $transaction['kode_transaksi']], $transaction);
        }
    }
}
