<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DoctorSeeder::class,
            SlotSeeder::class,
        ]);


        User::factory()->create([
            'name' => 'Test User',
            'full_name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '0123456789',
        ]);
    }
}
