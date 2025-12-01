<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Administrador por defecto
        User::create([
            'name' => 'Nestor Rojas',
            'username' => 'admin',
            'password' => Hash::make('123123'),
            'role' => 'admin'
        ]);

        // Usuario por defecto
        User::create([
            'name' => 'Lucas Chavez',
            'username' => 'user',
            'password' => Hash::make('123123'),
            'role' => 'user'
        ]);
    }
}
