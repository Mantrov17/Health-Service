<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Doctor",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "name", type: "string", example: "Иванов Иван Иванович"),
        new OA\Property(property: "qualification", type: "string", example: "Терапевт"),
        new OA\Property(property: "experience", type: "integer", example: 10),
        new OA\Property(property: "rating", type: "number", format: "float", example: 4.5),
        new OA\Property(property: "avatar", type: "string", example: "https://example.com/avatar.jpg"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
    ]
)]
class Doctor extends Model
{
    protected $fillable = [
        'name',
        'qualification',
        'experience',
        'rating',
        'avatar',
    ];

    public function slots()
    {
        return $this->hasMany(Slot::class);
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
