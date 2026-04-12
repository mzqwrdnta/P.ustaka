<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Normal User',
            'email' => 'user@example.com',
            'role' => 'user',
        ]);

        \App\Models\Setting::create([
            'key' => 'denda_per_hari',
            'value' => '2000',
        ]);

        \App\Models\Setting::create([
            'key' => 'maksimal_hari_pinjam',
            'value' => '7',
        ]);
    }
}
