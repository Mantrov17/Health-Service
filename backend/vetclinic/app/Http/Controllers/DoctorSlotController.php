<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class DoctorSlotController extends Controller
{
    #[OA\Get(
        path: "/doctors/{doctor}/slots",
        summary: "Получить свободные слоты врача",
        tags: ["Doctors", "Slots"],
        parameters: [
            new OA\Parameter(
                name: "doctor",
                in: "path",
                required: true,
                description: "ID врача",
                schema: new OA\Schema(type: "integer")
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
                    properties: [
                        new OA\Property(property: "current_page", type: "integer", example: 1),
                        new OA\Property(property: "data", type: "array", items: new OA\Items(ref: "#/components/schemas/Slot")),
                        new OA\Property(property: "total", type: "integer", example: 100),
                        new OA\Property(property: "per_page", type: "integer", example: 50),
                    ]
                )
            ),
            new OA\Response(response: 404, description: "Врач не найден")
        ]
    )]
    public function index(Doctor $doctor, Request $request)
    {
        $query = $doctor->slots()
            ->where('status', 'FREE')
            ->where('start_at', '>', now()); // ✅ только будущие

        // опционально: фильтры диапазона
        if ($request->filled('from')) {
            $query->where('start_at', '>=', $request->string('from'));
        }
        if ($request->filled('to')) {
            $query->where('start_at', '<=', $request->string('to'));
        }

        return response()->json(
            $query->orderBy('start_at')->paginate(50)
        );
    }
}
