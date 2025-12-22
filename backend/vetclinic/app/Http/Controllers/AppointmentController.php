<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use OpenApi\Attributes as OA;

class AppointmentController extends Controller
{
    #[OA\Post(
        path: "/appointments",
        summary: "Создать запись к врачу",
        tags: ["Appointments"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["slotId", "userId"],
                properties: [
                    new OA\Property(property: "slotId", type: "integer", example: 1),
                    new OA\Property(property: "userId", type: "integer", example: 1),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Запись успешно создана",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "id", type: "integer", example: 1),
                        new OA\Property(property: "doctorId", type: "integer", example: 1),
                        new OA\Property(property: "slotId", type: "integer", example: 1),
                        new OA\Property(property: "startAt", type: "string", format: "date-time"),
                        new OA\Property(property: "endAt", type: "string", format: "date-time"),
                        new OA\Property(property: "status", type: "string", example: "BOOKED"),
                    ]
                )
            ),
            new OA\Response(response: 400, description: "Нельзя записаться на прошедший слот"),
            new OA\Response(response: 409, description: "Слот уже занят"),
            new OA\Response(response: 422, description: "Ошибка валидации")
        ]
    )]
    public function store(Request $request)
    {
        $data = $request->validate([
            'slotId' => ['required', 'integer', 'exists:slots,id'],
            'userId' => ['required', 'integer', 'exists:users,id'],
        ]);

        return \Illuminate\Support\Facades\DB::transaction(function () use ($data) {

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
                'user_id'   => $data['userId'],
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

    #[OA\Get(
        path: "/me/appointments",
        summary: "Получить список записей пользователя (требует auth)",
        tags: ["Appointments"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Успешный ответ",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(
                        properties: [
                            new OA\Property(property: "id", type: "integer", example: 1),
                            new OA\Property(property: "status", type: "string", example: "BOOKED"),
                            new OA\Property(property: "doctorName", type: "string", example: "Иванов Иван Иванович"),
                            new OA\Property(property: "qualification", type: "string", example: "Терапевт"),
                            new OA\Property(property: "slotId", type: "integer", example: 1),
                            new OA\Property(property: "startAt", type: "string", format: "date-time"),
                            new OA\Property(property: "endAt", type: "string", format: "date-time"),
                        ]
                    )
                )
            )
        ]
    )]
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

    #[OA\Post(
        path: "/appointments/{appointment}/cancel",
        summary: "Отменить запись",
        tags: ["Appointments"],
        parameters: [
            new OA\Parameter(
                name: "appointment",
                in: "path",
                required: true,
                description: "ID записи",
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Запись успешно отменена",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                    ]
                )
            ),
            new OA\Response(response: 404, description: "Запись не найдена")
        ]
    )]
    public function cancel(Appointment $appointment, Request $request)
    {

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
