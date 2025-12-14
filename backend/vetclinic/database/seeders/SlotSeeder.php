<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Slot;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;

class SlotSeeder extends Seeder
{
    public function run(): void
    {
        // Генерим слоты на 7 дней вперёд:
        // каждый день 10:00–18:00, шаг 30 минут, слот 30 минут
        $days = 7;
        $startHour = 10;
        $endHour = 18;
        $stepMinutes = 30;

        $now = CarbonImmutable::now()->startOfDay();

        $doctors = Doctor::query()->get();

        foreach ($doctors as $doctor) {
            $rows = [];

            for ($d = 0; $d < $days; $d++) {
                $day = $now->addDays($d);

                $t = $day->setTime($startHour, 0);
                $end = $day->setTime($endHour, 0);

                while ($t < $end) {
                    $rows[] = [
                        'doctor_id' => $doctor->id,
                        'start_at' => $t,
                        'end_at' => $t->addMinutes($stepMinutes),
                        'status' => 'FREE',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    $t = $t->addMinutes($stepMinutes);
                }
            }

            // Чтобы не ловить дубль при повторном seed:
            // можно перед вставкой очистить слоты врача
            Slot::where('doctor_id', $doctor->id)->delete();
            Slot::insert($rows);
        }
    }
}
