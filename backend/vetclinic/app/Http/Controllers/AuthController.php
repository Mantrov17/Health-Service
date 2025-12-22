<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class AuthController extends Controller
{
    #[OA\Post(
        path: "/auth/register",
        summary: "Регистрация нового пользователя",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["fullName", "phone", "email", "password"],
                properties: [
                    new OA\Property(property: "fullName", type: "string", example: "Иван Иванов"),
                    new OA\Property(property: "phone", type: "string", example: "+79991234567"),
                    new OA\Property(property: "email", type: "string", format: "email", example: "ivan@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password123"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Пользователь успешно зарегистрирован",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "user", ref: "#/components/schemas/User"),
                        new OA\Property(property: "accessToken", type: "string", example: "1|xxxxxxxxxxxxxxxxxxxx"),
                    ]
                )
            ),
            new OA\Response(response: 422, description: "Ошибка валидации")
        ]
    )]
    public function register(Request $request)
    {
        $data = $request->validate([
            'fullName' => ['required', 'string', 'min:3', 'max:255'],
            'phone'    => ['required', 'string', 'max:32', 'unique:users,phone'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:255'],
        ]);

        $user = User::create([
            'full_name' => $data['fullName'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            // поле name можно оставить, чтобы не ломать дефолтные части:
            'name' => $data['fullName'],
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => $this->userDto($user),
            'accessToken' => $token,
        ], 201);
    }

    #[OA\Post(
        path: "/auth/login",
        summary: "Вход в систему",
        tags: ["Auth"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ["login", "password"],
                properties: [
                    new OA\Property(property: "login", type: "string", description: "Email или телефон", example: "ivan@example.com"),
                    new OA\Property(property: "password", type: "string", format: "password", example: "password123"),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Успешный вход",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "user", ref: "#/components/schemas/User"),
                        new OA\Property(property: "accessToken", type: "string", example: "2|xxxxxxxxxxxxxxxxxxxx"),
                    ]
                )
            ),
            new OA\Response(response: 422, description: "Неверные учетные данные")
        ]
    )]
    public function login(Request $request)
    {
        $data = $request->validate([
            'login'    => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $login = $data['login'];

        $user = User::query()
            ->where('email', $login)
            ->orWhere('phone', $login)
            ->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Invalid credentials.'],
            ]);
        }

        // опционально: удалить старые токены
        // $user->tokens()->delete();

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user' => $this->userDto($user),
            'accessToken' => $token,
        ]);
    }

    #[OA\Post(
        path: "/auth/logout",
        summary: "Выход из системы",
        security: [["sanctum" => []]],
        tags: ["Auth"],
        responses: [
            new OA\Response(
                response: 200,
                description: "Успешный выход",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                    ]
                )
            ),
            new OA\Response(response: 401, description: "Не авторизован")
        ]
    )]
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['success' => true]);
    }

    private function userDto(User $user): array
    {
        return [
            'id' => $user->id,
            'fullName' => $user->full_name,
            'phone' => $user->phone,
            'email' => $user->email,
        ];
    }
}
