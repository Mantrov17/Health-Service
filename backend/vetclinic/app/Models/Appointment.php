<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: "Appointment",
    properties: [
        new OA\Property(property: "id", type: "integer", example: 1),
        new OA\Property(property: "user_id", type: "integer", example: 1),
        new OA\Property(property: "doctor_id", type: "integer", example: 1),
        new OA\Property(property: "slot_id", type: "integer", example: 1),
        new OA\Property(property: "status", type: "string", enum: ["BOOKED", "CANCELLED"], example: "BOOKED"),
        new OA\Property(property: "cancelled_at", type: "string", format: "date-time", nullable: true),
        new OA\Property(property: "created_at", type: "string", format: "date-time"),
        new OA\Property(property: "updated_at", type: "string", format: "date-time"),
    ]
)]
class Appointment extends Model
{
    protected $fillable = [
        'user_id',
        'doctor_id',
        'slot_id',
        'status',
        'cancelled_at',
    ];

    protected $casts = [
        'cancelled_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }
}

