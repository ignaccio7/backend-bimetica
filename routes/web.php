<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PublicProjectController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ResourceGalleryController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
    // REDIRIGIR AL LOGIN
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');


// ── Solo ADMIN ────────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:admin'])->group(function () {

    // Users
    Route::get('/users', [UserController::class, 'index'])->name('user.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('user.create');
    Route::post('/users', [UserController::class, 'store'])->name('user.store');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('user.destroy');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('user.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('user.update');
    Route::patch('/user/{user}/reset-password', [UserController::class, 'resetPassword'])->name('user.resetPassword');

    // Services
    Route::get('/services', [ServiceController::class, 'index'])->name('service.index');
    Route::get('/services/create', [ServiceController::class, 'create'])->name('service.create');
    Route::post('/services', [ServiceController::class, 'store'])->name('service.store');
    Route::get('/services/{service}/edit', [ServiceController::class, 'edit'])->name('service.edit');
    Route::put('/services/{service}', [ServiceController::class, 'update'])->name('service.update');
    Route::delete('/services/{service}', [ServiceController::class, 'destroy'])->name('service.destroy');

    // Projects gestión
    Route::get('/projects/list', [ProjectController::class, 'list'])->name('project.list');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('project.create');
    Route::post('/projects', [ProjectController::class, 'store'])->name('project.store');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('project.edit');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('project.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('project.destroy');
    Route::delete('/projects/{project}/gallery/{index}', [ProjectController::class, 'destroyGalleryImage'])->name('project.gallery.destroy');

    // Public Projects
    Route::get('/public-projects', [PublicProjectController::class, 'index'])->name('public-project.index');
    Route::get('/public-projects/create', [PublicProjectController::class, 'create'])->name('public-project.create');
    Route::post('/public-projects', [PublicProjectController::class, 'store'])->name('public-project.store');
    Route::get('/public-projects/{publicProject}/edit', [PublicProjectController::class, 'edit'])->name('public-project.edit');
    Route::put('/public-projects/{publicProject}', [PublicProjectController::class, 'update'])->name('public-project.update');
    Route::delete('/public-projects/{publicProject}', [PublicProjectController::class, 'destroy'])->name('public-project.destroy');

    // Recursos PDFs gestión
    Route::get('/resources/manage', [ResourceController::class, 'index'])->name('resource.index');
    Route::get('/resources/create', [ResourceController::class, 'create'])->name('resource.create');
    Route::post('/resources', [ResourceController::class, 'store'])->name('resource.store');
    Route::get('/resources/{resource}/edit', [ResourceController::class, 'edit'])->name('resource.edit');
    Route::put('/resources/{resource}', [ResourceController::class, 'update'])->name('resource.update');
    Route::delete('/resources/{resource}', [ResourceController::class, 'destroy'])->name('resource.destroy');

    // Galerías gestión
    Route::get('/resource-galleries/manage', [ResourceGalleryController::class, 'index'])->name('resource-gallery.index');
    Route::get('/resource-galleries/create', [ResourceGalleryController::class, 'create'])->name('resource-gallery.create');
    Route::post('/resource-galleries', [ResourceGalleryController::class, 'store'])->name('resource-gallery.store');
    Route::get('/resource-galleries/{resourceGallery}/edit', [ResourceGalleryController::class, 'edit'])->name('resource-gallery.edit');
    Route::put('/resource-galleries/{resourceGallery}', [ResourceGalleryController::class, 'update'])->name('resource-gallery.update');
    Route::delete('/resource-galleries/{resourceGallery}', [ResourceGalleryController::class, 'destroy'])->name('resource-gallery.destroy');
});


// Rutas para TODOS los autenticados (admin y user)
Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Vista recursos (ambos roles)
    Route::get('/resources', [ResourceController::class, 'viewer'])->name('resource.viewer');
    Route::get('/resources/{resource}/pdf', [ResourceController::class, 'pdf'])->name('resource.pdf');

    // Vista galerías (ambos roles)
    Route::get('/resource-galleries', [ResourceGalleryController::class, 'viewer'])->name('resource-gallery.viewer');

    // Proyectos vista (ambos roles)
    Route::get('/projects', [ProjectController::class, 'index'])->name('project.index');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('project.show');
    Route::get('/projects/{project}/pdf', [ProjectController::class, 'pdf'])->name('project.pdf');
    Route::get('/projects/{project}/cover', [ProjectController::class, 'cover'])->name('project.cover');
    Route::get('/projects/{project}/gallery/{index}', [ProjectController::class, 'galleryImage'])->name('project.gallery.image');
});


require __DIR__ . '/auth.php';
