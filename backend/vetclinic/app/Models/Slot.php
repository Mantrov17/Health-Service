<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Slot",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "doctor_id", type: "integer", example: 1),
        new OA\Property(property: "start_at", type: "string", format: "date-time", example: "2025-12-25T09:00:00Z"),
        new OA\Property(property: "end_at", type: "string", format: "date-time", example: "2025-12-25T09:30:00Z"),
        new OA\Property(property: "status", type: "string", enum: ["FREE", "BOOKED"], example: "FREE"),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
    ]
)]
class Slot extends Model
{
    protected $fillable = [
        'doctor_id',
        'start_at',
        'end_at',
        'status',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at'   => 'datetime',
    ];

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function appointment()
    {
        return $this->hasOne(Appointment::class);
    }
}

