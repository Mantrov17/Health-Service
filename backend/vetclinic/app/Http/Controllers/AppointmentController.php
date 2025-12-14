<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class AppointmentController extends Controller
{
    // POST /api/appointments
    public function store(Request $request)
    {
        $data = $request->validate([
            'slotId' => ['required', 'integer', 'exists:slots,id'],
        ]);

        $user = $request->user();

        return \Illuminate\Support\Facades\DB::transaction(function () use ($data, $user) {

            // 1) Блокируем слот на время транзакции
            $slot = \App\Models\Slot::query()
                ->whereKey($data['slotId'])
                ->lockForUpdate()
                ->firstOrFail();

            // 2) Приводим даты к Carbon (на случай, если касты не настроены)
            $startAt = $slot->start_at instanceof \Carbon\CarbonInterface
                ? $slot->start_at
                : \Illuminate\Support\Carbon::parse($slot->start_at);

            $endAt = $slot->end_at instanceof \Carbon\CarbonInterface
                ? $slot->end_at
                : \Illuminate\Support\Carbon::parse($slot->end_at);

            // 3) Бизнес-проверки
            if ($slot->status !== 'FREE') {
                abort(409, 'Slot already booked');
            }

            if ($startAt->isPast()) {
                abort(400, 'Cannot book past slot');
            }

            // На случай рассинхрона: appointment уже есть, а слот почему-то FREE
            if (\App\Models\Appointment::query()->where('slot_id', $slot->id)->exists()) {
                abort(409, 'Slot already booked');
            }

            // 4) Создаём запись
            $appointment = \App\Models\Appointment::query()->create([
                'user_id'   => $user->id,
                'doctor_id' => $slot->doctor_id,
                'slot_id'   => $slot->id,
                'status'    => 'BOOKED',
            ]);

            // 5) Помечаем слот как занятый
            $slot->status = 'BOOKED';
            $slot->save();

            // 6) Ответ
            return response()->json([
                'id'       => $appointment->id,
                'doctorId' => $appointment->doctor_id,
                'slotId'   => $slot->id,
                'startAt'  => $startAt->toIso8601String(),
                'endAt'    => $endAt->toIso8601String(),
                'status'   => $appointment->status,
            ], 201);
        });
    }

    // GET /api/me/appointments
    public function myAppointments(Request $request)
    {
        $userId = $request->user()->id;

        $items = Appointment::with(['doctor', 'slot'])
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($a) => [
                'id' => $a->id,
                'status' => $a->status,
                'doctorName' => $a->doctor->name,
                'qualification' => $a->doctor->qualification,
                'slotId' => $a->slot_id,
                'startAt' => $a->slot->start_at->toISOString(),
                'endAt' => $a->slot->end_at->toISOString(),
            ]);

        return response()->json($items);
    }

    // POST /api/appointments/{appointment}/cancel
    public function cancel(Appointment $appointment, Request $request)
    {
        if ($appointment->user_id !== $request->user()->id) {
            abort(403, 'Forbidden');
        }

        if ($appointment->status === 'CANCELLED') {
            return response()->json(['success' => true]); // идемпотентно
        }

        DB::transaction(function () use ($appointment) {
            $appointment->update([
                'status' => 'CANCELLED',
                'cancelled_at' => now(),
            ]);

            // возвращаем слот в FREE
            $appointment->slot()->update(['status' => 'FREE']);
        });

        return response()->json(['success' => true]);
    }
}
