<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MeController extends Controller
{
    public function show(Request $request)
    {
        $u = $request->user();

        return response()->json([
            'id' => $u->id,
            'fullName' => $u->full_name,
            'phone' => $u->phone,
            'email' => $u->email,
        ]);
    }

    public function update(Request $request)
    {
        $u = $request->user();

        $data = $request->validate([
            'fullName' => ['sometimes', 'string', 'min:3', 'max:255'],
            'phone'    => ['sometimes', 'string', 'max:32', 'unique:users,phone,' . $u->id],
            'email'    => ['sometimes', 'email', 'max:255', 'unique:users,email,' . $u->id],
        ]);

        if (array_key_exists('fullName', $data)) {
            $u->full_name = $data['fullName'];
            $u->name = $data['fullName'];
        }
        if (array_key_exists('phone', $data)) $u->phone = $data['phone'];
        if (array_key_exists('email', $data)) $u->email = $data['email'];

        $u->save();

        return response()->json([
            'id' => $u->id,
            'fullName' => $u->full_name,
            'phone' => $u->phone,
            'email' => $u->email,
        ]);
    }
}
