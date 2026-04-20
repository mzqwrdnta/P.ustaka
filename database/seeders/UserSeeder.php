<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'id' => 1,
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => '$2y$12$6p5tNoq9d9V9vj9j9j9j9u.XjXjXjXjXjXjXjXjXjXjXjXjXjXjXj', // Original Admin
                'role' => 'admin',
                'email_verified_at' => '2026-04-07 23:51:15',
            ],
            [
                'id' => 2,
                'name' => 'Normal User',
                'email' => 'user@example.com',
                'password' => '$2y$12$6p5tNoq9d9V9vj9j9j9j9u.XjXjXjXjXjXjXjXjXjXjXjXjXjXjXj',
                'role' => 'user',
                'email_verified_at' => '2026-04-07 23:51:15',
            ],
            [
                'id' => 3,
                'name' => 'muhamad zaqi wiradimana',
                'email' => 'mzq@gmail.com',
                'password' => '$2y$12$4m0/X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X',
                'role' => 'user',
            ],
            [
                'id' => 4,
                'name' => 'asepudin',
                'email' => 'asep@gmail.com',
                'password' => '$2y$12$M6bX0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X',
                'role' => 'user',
            ],
            [
                'id' => 6,
                'name' => 'Test Admin',
                'email' => 'test@example.com',
                'password' => '$2y$12$v8bX0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X',
                'role' => 'user',
            ],
            [
                'id' => 7,
                'name' => 'junadi hasbullah',
                'email' => 'jaidi@gmail.com',
                'password' => '$2y$12$E8bX0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X',
                'role' => 'user',
            ],
            [
                'id' => 8,
                'name' => 'Herni',
                'email' => 'herni@gmail.com',
                'password' => '$2y$12$N8bX0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X0X',
                'role' => 'user',
            ],
            [
                'id' => 9,
                'name' => 'Verdi Alifahsam',
                'email' => 'verdi@gmail.com',
                'password' => '$2y$12$.04t4q0u4N7UklO7wViRh.0uzX/KnpRsBw0PdUhc.7eLjRLLkTHvy',
                'role' => 'user',
            ],
            [
                'id' => 10,
                'name' => 'maimunah',
                'email' => 'user@gmail.com',
                'password' => '$2y$12$pOI4SBi3Z4xdo.B/..CLbuoexjHqHeHwyjxYf8ghCpfU.7f6UtY36',
                'role' => 'user',
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['id' => $userData['id']],
                array_merge($userData, [
                    'password' => $userData['password'] ?? Hash::make('password'),
                ])
            );
        }
    }
}
