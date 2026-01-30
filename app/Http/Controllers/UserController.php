<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    //
    public function index(Request $request): Response
    {
        // dd($request->headers->all());
        $users = User::all();
        return Inertia::render('User/List', [
            'users' => $users
        ]);
    }

    public function create()
    {
        return Inertia::render('User/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'rol' => 'required|string|max:255',
            'password' => 'required|string|max:255',
            // 'password_confirmation' => 'nullable|string|max:255',
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'role' => $validated['rol'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('user.index');
    }
}
