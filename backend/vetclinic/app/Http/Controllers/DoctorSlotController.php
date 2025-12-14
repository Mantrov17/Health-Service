<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorSlotController extends Controller
{
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
