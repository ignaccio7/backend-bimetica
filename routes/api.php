<?php

use App\Http\Controllers\PublicProjectController;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/services/menu', [ServiceController::class, 'menu'])->name('service.menu');
Route::get('/services/{type}', [ServiceController::class, 'list'])->name('service.list');
Route::get('/projects', [PublicProjectController::class, 'list'])->name('public-project.list');
