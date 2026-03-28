<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    //
    public function index(Request $request): Response
    {
        // dd($request->headers->all());
        $users = User::all();
        Log::info($users);
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
        Log::info($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'rol' => 'required|string|max:255',
            'password' => 'required|string|max:255|confirmed',
            'password_confirmation' => 'required|string|max:255',
        ]);

        Log::info($validated);

        User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'role' => $validated['rol'],
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('user.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $user)
    {
        return Inertia::render('User/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'rol' => 'required|string|max:255',
        ]);

        $user->update($validated);
        return redirect()->route('user.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $user)
    {
        Log::info("Eliminando usuario: " . $user->username);
        $user->delete();
        return redirect()->route('user.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }

    public function resetPassword(User $user)
    {
        $newPassword = Str::random(10);
        $user->update([
            'password' => Hash::make($newPassword)
        ]);

        return back()->with('new_password', $newPassword);
    }
}
