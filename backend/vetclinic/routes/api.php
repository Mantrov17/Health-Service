<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\DoctorSlotController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MeController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\SlotController;

// Auth routes (optional, if needed)
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// Me routes (optional, if needed)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [MeController::class, 'show']);
    Route::patch('/me', [MeController::class, 'update']);
    Route::get('/me/appointments', [AppointmentController::class, 'myAppointments']);
});

// Doctor CRUD
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);
Route::post('/doctors', [DoctorController::class, 'store']);
Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);
Route::get('/doctors/{doctor}/slots', [DoctorSlotController::class, 'index']);

// Slot CRUD
Route::get('/slots', [SlotController::class, 'index']);
Route::get('/slots/{slot}', [SlotController::class, 'show']);
Route::post('/slots', [SlotController::class, 'store']);
Route::put('/slots/{slot}', [SlotController::class, 'update']);
Route::delete('/slots/{slot}', [SlotController::class, 'destroy']);

// Appointment routes
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
