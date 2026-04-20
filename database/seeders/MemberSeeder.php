<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'id' => 1,
                'user_id' => 3,
                'nis' => '09876543456789',
                'nama_lengkap' => 'muhamad zaqi wiradimana',
                'kelas' => 'XI-PPLG',
                'jenis_kelamin' => 'Laki-laki',
                'no_hp' => '098765434567',
                'alamat' => 'kjhg',
                'status_aktif' => 1,
            ],
            [
                'id' => 2,
                'user_id' => 4,
                'nis' => '098765432123',
                'nama_lengkap' => 'asepudin',
                'kelas' => 'XII-PPLG',
                'jenis_kelamin' => 'Laki-laki',
                'no_hp' => '098765456789',
                'status_aktif' => 1,
            ],
            [
                'id' => 4,
                'user_id' => 6,
                'nis' => '098765567',
                'nama_lengkap' => 'jainudin',
                'kelas' => 'XI-PPLG',
                'jenis_kelamin' => 'Laki-laki',
                'no_hp' => '0987654566',
                'alamat' => 'hjgghfghjhkhh',
                'status_aktif' => 1,
            ],
            [
                'id' => 5,
                'user_id' => 7,
                'nis' => '567887678987',
                'nama_lengkap' => 'junadi hasbullah',
                'kelas' => 'XI-AKL',
                'jenis_kelamin' => 'Laki-laki',
                'no_hp' => '098765678',
                'alamat' => 'akshdchijcns sdcdsc sdccsui',
                'status_aktif' => 1,
            ],
            [
                'id' => 6,
                'user_id' => 8,
                'nis' => '9876545678987',
                'nama_lengkap' => 'Herni',
                'kelas' => 'X-AKL',
                'jenis_kelamin' => 'Perempuan',
                'no_hp' => '082328605386',
                'alamat' => 'ashfuisshhSfhuddv',
                'foto' => 'members/cPPNIApQ0Am1NaiVcaNRz2NGKf1LxaabPjKcyibY.webp',
                'status_aktif' => 1,
            ],
            [
                'id' => 7,
                'user_id' => 9,
                'nis' => '0987656789876',
                'nama_lengkap' => 'Verdi Alifahsam',
                'kelas' => 'XI-PPLG',
                'jenis_kelamin' => 'Laki-laki',
                'no_hp' => '085774093174',
                'alamat' => 'jalan mpuy',
                'foto' => 'members/SksNfuZ411UELLfXhZ1bauznS1DA4BSZUqFX7m2R.png',
                'status_aktif' => 1,
            ],
            [
                'id' => 8,
                'user_id' => 10,
                'nis' => '23456787654',
                'nama_lengkap' => 'maimunah',
                'kelas' => 'XII-MPLB',
                'jenis_kelamin' => 'Perempuan',
                'no_hp' => '098765567890',
                'alamat' => ';uytrdbnjiutrfvhu8',
                'status_aktif' => 1,
            ],
        ];

        foreach ($members as $member) {
            Member::updateOrCreate(['id' => $member['id']], $member);
        }
    }
}
