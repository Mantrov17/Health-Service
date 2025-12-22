<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;
use OpenApi\Attributes as OA;

class DoctorController extends Controller
{
    #[OA\Get(
        path: "/doctors",
        summary: "Получить список всех врачей",
        tags: ["Doctors"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Успешный ответ",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(ref: "#/components/schemas/Doctor")
                )
            )
        ]
    )]
    public function index()
    {
        return response()->json(
            Doctor::all()
        );
    }

    #[OA\Post(
        path: "/doctors",
        summary: "Создать нового врача",
        tags: ["Doctors"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["name", "qualification"],
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Иванов Иван Иванович"),
                    new OA\Property(property: "qualification", type: "string", example: "Терапевт"),
                    new OA\Property(property: "experience", type: "integer", example: 10),
                    new OA\Property(property: "rating", type: "number", format: "float", example: 4.5),
                    new OA\Property(property: "avatar", type: "string", example: "https://example.com/avatar.jpg"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Врач успешно создан",
                content: new OA\JsonContent(ref: "#/components/schemas/Doctor")
            ),
            new OA\Response(response: 422, description: "Ошибка валидации")
        ]
    )]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'qualification' => 'required|string|max:255',
            'experience' => 'nullable|integer|min:0',
            'rating' => 'nullable|numeric|min:0|max:5',
            'avatar' => 'nullable|string|url',
        ]);

        $doctor = Doctor::create($validated);

        return response()->json($doctor, 201);
    }

    #[OA\Get(
        path: "/doctors/{id}",
        summary: "Получить информацию о враче",
        tags: ["Doctors"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID врача",
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Успешный ответ",
                content: new OA\JsonContent(ref: "#/components/schemas/Doctor")
            ),
            new OA\Response(response: 404, description: "Врач не найден")
        ]
    )]
    public function show(Doctor $doctor)
    {
        return response()->json($doctor);
    }

    #[OA\Put(
        path: "/doctors/{id}",
        summary: "Обновить информацию о враче",
        tags: ["Doctors"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID врача",
                schema: new OA\Schema(type: "integer")
            )
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: "name", type: "string", example: "Иванов Иван Иванович"),
                    new OA\Property(property: "qualification", type: "string", example: "Терапевт"),
                    new OA\Property(property: "experience", type: "integer", example: 10),
                    new OA\Property(property: "rating", type: "number", format: "float", example: 4.5),
                    new OA\Property(property: "avatar", type: "string", example: "https://example.com/avatar.jpg"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Врач успешно обновлен",
                content: new OA\JsonContent(ref: "#/components/schemas/Doctor")
            ),
            new OA\Response(response: 404, description: "Врач не найден"),
            new OA\Response(response: 422, description: "Ошибка валидации")
        ]
    )]
    public function update(Request $request, Doctor $doctor)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'qualification' => 'sometimes|required|string|max:255',
            'experience' => 'nullable|integer|min:0',
            'rating' => 'nullable|numeric|min:0|max:5',
            'avatar' => 'nullable|string|url',
        ]);

        $doctor->update($validated);

        return response()->json($doctor);
    }

    #[OA\Delete(
        path: "/doctors/{id}",
        summary: "Удалить врача",
        tags: ["Doctors"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "ID врача",
                schema: new OA\Schema(type: "integer")
            )
        ],
        responses: [
            new OA\Response(response: 204, description: "Врач успешно удален"),
            new OA\Response(response: 404, description: "Врач не найден")
        ]
    )]
    public function destroy(Doctor $doctor)
    {
        $doctor->delete();

        return response()->json(null, 204);
    }
}
