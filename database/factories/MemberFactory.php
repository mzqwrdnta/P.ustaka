<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Member>
 */
class MemberFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nis' => fake()->unique()->numerify('######'),
            'nama_lengkap' => fake()->name(),
            'kelas' => fake()->randomElement(['X PPLG', 'XI PPLG', 'XII PPLG']),
            'jenis_kelamin' => fake()->randomElement(['Laki-laki', 'Perempuan']),
            'no_hp' => fake()->phoneNumber(),
            'alamat' => fake()->address(),
            'status_aktif' => true,
        ];
    }
}
