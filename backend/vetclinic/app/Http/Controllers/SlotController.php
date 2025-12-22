<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Slot;
use OpenApi\Attributes as OA;

class SlotController extends Controller
{
    #[OA\Get(
        path: "/slots",
        summary: "Получить список всех слотов",
        tags: ["Slots"],
        parameters: [
            new OA\Parameter(
                name: "doctor_id",
                in: "query",
                required: false,
                description: "Фильтр по ID врача",
                schema: new OA\Schema(type: "integer")
            ),
            new OA\Parameter(
                name: "status",
                in: "query",
                required: false,
                description: "Фильтр по статусу (FREE, BOOKED)",
                schema: new OA\Schema(type: "string", enum: ["FREE", "BOOKED"])
            ),
            new OA\Parameter(
                name: "from",
                in: "query",
                required: false,
                description: "Фильтр по дате начала (от)",
                schema: new OA\Schema(type: "string", format: "date-time")
            ),
            new OA\Parameter(
                name: "to",
                in: "query",
                required: false,
                description: "Фильтр по дате начала (до)",
                schema: new OA\Schema(type: "string", format: "date-time")
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Успешный ответ",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/Slot")
                )
            )
        ]
    )]
    public function index(Request $request)
    {
        $query = Slot::query();

        if ($request->filled('doctor_id')) {
            $query->where('doctor_id', $request->integer('doctor_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('from')) {
            $query->where('start_at', '>=', $request->string('from'));
        }

        if ($request->filled('to')) {
            $query->where('start_at', '<=', $request->string('to'));
        }

        return response()->json($query->orderBy('start_at')->get());
    }

    #[OA\Post(
        path: "/slots",
        summary: "Создать новый слот",
        tags: ["Slots"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["doctor_id", "start_at", "end_at"],
                properties: [
                    new OA\Property(property: "doctor_id", type: "integer", example: 1),
                    new OA\Property(property: "start_at", type: "string", format: "date-time", example: "2025-12-25T09:00:00Z"),
                    new OA\Property(property: "end_at", type: "string", format: "date-time", example: "2025-12-25T09:30:00Z"),
                    new OA\Property(property: "status", type: "string", enum: ["FREE", "BOOKED"], example: "FREE"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Слот успешно создан",
                content: new OA\JsonContent(ref: "#/components/schemas/Slot")
            ),
            new OA\Response(response: 422, description: "Ошибка валидации")
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|integer|exists:doctors,id',
            'start_at' => 'required|date',
            'end_at' => 'required|date|after:start_at',
            'status' => 'sometimes|in:FREE,BOOKED',
        ]);

        $validated['status'] = $validated['status'] ?? 'FREE';

        $slot = Slot::create($validated);

        return response()->json($slot, 201);
    }

    #[OA\Get(
        path: "/slots/{id}",
        summary: "Получить информацию о слоте",
        tags: ["Slots"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID слота",
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Успешный ответ",
                content: new OA\JsonContent(ref: "#/components/schemas/Slot")
            ),
            new OA\Response(response: 404, description: "Слот не найден")
        ]
    )]
    public function show(Slot $slot)
    {
        return response()->json($slot);
    }

    #[OA\Put(
        path: "/slots/{id}",
        summary: "Обновить слот",
        tags: ["Slots"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID слота",
                schema: new OA\Schema(type: "integer")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "doctor_id", type: "integer", example: 1),
                    new OA\Property(property: "start_at", type: "string", format: "date-time", example: "2025-12-25T09:00:00Z"),
                    new OA\Property(property: "end_at", type: "string", format: "date-time", example: "2025-12-25T09:30:00Z"),
                    new OA\Property(property: "status", type: "string", enum: ["FREE", "BOOKED"], example: "FREE"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Слот успешно обновлен",
                content: new OA\JsonContent(ref: "#/components/schemas/Slot")
            ),
            new OA\Response(response: 404, description: "Слот не найден"),
            new OA\Response(response: 422, description: "Ошибка валидации")
        ]
    )]
    public function update(Request $request, Slot $slot)
    {
        $validated = $request->validate([
            'doctor_id' => 'sometimes|integer|exists:doctors,id',
            'start_at' => 'sometimes|date',
            'end_at' => 'sometimes|date|after:start_at',
            'status' => 'sometimes|in:FREE,BOOKED',
        ]);

        $slot->update($validated);

        return response()->json($slot);
    }

    #[OA\Delete(
        path: "/slots/{id}",
        summary: "Удалить слот",
        tags: ["Slots"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID слота",
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(response: 204, description: "Слот успешно удален"),
            new OA\Response(response: 404, description: "Слот не найден")
        ]
    )]
    public function destroy(Slot $slot)
    {
        $slot->delete();

        return response()->json(null, 204);
    }
}
