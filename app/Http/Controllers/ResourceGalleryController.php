<?php

namespace App\Http\Controllers;

use App\Models\ResourceGallery;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ResourceGalleryController extends Controller
{
    public function index(): Response
    {
        $services = Service::with(['galleries' => fn($q) => $q->orderBy('order')])
            ->whereHas('galleries')
            ->get(['id', 'title', 'slug'])
            ->map(function ($service) {
                return [
                    'id'      => $service->id,
                    'title'   => $service->title,
                    'galleries' => $service->galleries->map(fn($g) => [
                        'id'          => $g->id,
                        'title'       => $g->title,
                        'order'       => $g->order,
                        'image_count' => count($g->images ?? []),
                        // URLs privadas de cada imagen
                        'image_urls'  => collect($g->images ?? [])
                            ->map(fn($path, $i) => route('resource-gallery.image', [
                                'gallery' => $g->id,
                                'index'   => $i,
                            ]))
                            ->values(),
                    ]),
                ];
            });

        return Inertia::render('Resource/Gallery/List', [
            'services' => $services,
        ]);
    }

    public function create(): Response
    {
        $services = Service::select('id', 'title')->orderBy('title')->get();

        return Inertia::render('Resource/Gallery/Create', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'title'      => 'nullable|string|max:255',
            'order'      => 'nullable|integer',
            'images'     => 'required|array|min:1',
            'images.*'   => 'file|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        $paths = [];
        foreach ($request->file('images') as $image) {
            $paths[] = $image->store('resource-galleries', 'private');
        }

        ResourceGallery::create([
            'service_id' => $request->service_id,
            'title'      => $request->title,
            'order'      => $request->order ?? 0,
            'images'     => $paths,
        ]);

        return redirect()->route('resource-gallery.index')
            ->with('success', 'Galería creada');
    }

    public function edit(ResourceGallery $resourceGallery): Response
    {
        $services = Service::select('id', 'title')->orderBy('title')->get();

        $imageUrls = collect($resourceGallery->images ?? [])
            ->map(fn($path, $i) => [
                'index' => $i,
                'url'   => route('resource-gallery.image', [
                    'gallery' => $resourceGallery->id,
                    'index'   => $i,
                ]),
            ])
            ->values();

        return Inertia::render('Resource/Gallery/Edit', [
            'gallery'   => [
                'id'         => $resourceGallery->id,
                'service_id' => $resourceGallery->service_id,
                'title'      => $resourceGallery->title,
                'order'      => $resourceGallery->order,
                'image_urls' => $imageUrls,
            ],
            'services' => $services,
        ]);
    }

    public function update(Request $request, ResourceGallery $resourceGallery)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
            'title'      => 'nullable|string|max:255',
            'order'      => 'nullable|integer',
            'images'     => 'nullable|array',
            'images.*'   => 'file|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        $paths = $resourceGallery->images ?? [];

        // Agregar nuevas imágenes a las existentes
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $paths[] = $image->store('resource-galleries', 'private');
            }
        }

        $resourceGallery->update([
            'service_id' => $request->service_id,
            'title'      => $request->title,
            'order'      => $request->order ?? 0,
            'images'     => $paths,
        ]);

        return redirect()->route('resource-gallery.index')
            ->with('success', 'Galería actualizada exitosamente.');
    }

    // Eliminar una imagen individual de la galería (igual que project.gallery.destroy)
    public function destroyImage(ResourceGallery $resourceGallery, int $index)
    {
        $images = $resourceGallery->images ?? [];

        if (!isset($images[$index])) {
            abort(404, 'Imagen no encontrada');
        }

        $path = $images[$index];
        if (Storage::disk('private')->exists($path)) {
            Storage::disk('private')->delete($path);
        }

        array_splice($images, $index, 1);

        $resourceGallery->update([
            'images' => !empty($images) ? array_values($images) : [],
        ]);

        return back()->with('success', 'Imagen eliminada');
    }

    public function destroy(ResourceGallery $resourceGallery)
    {
        foreach ($resourceGallery->images ?? [] as $path) {
            if (Storage::disk('private')->exists($path)) {
                Storage::disk('private')->delete($path);
            }
        }

        $resourceGallery->delete();

        return redirect()->route('resource-gallery.index')
            ->with('success', 'Galería eliminada exitosamente.');
    }

    // Sirve imagen privada — solo autenticados
    public function image(ResourceGallery $gallery, int $index)
    {
        $images = $gallery->images ?? [];

        if (!isset($images[$index])) {
            abort(404);
        }

        $path = $images[$index];

        if (!Storage::disk('private')->exists($path)) {
            abort(404);
        }

        return response()->file(Storage::disk('private')->path($path));
    }

    // Vista usuario — agrupa por servicio igual que recursos PDF
    public function viewer(): Response
    {
        $services = Service::with(['galleries' => fn($q) => $q->orderBy('order')])
            ->whereHas('galleries')
            ->get(['id', 'title', 'slug'])
            ->map(function ($service) {
                return [
                    'id'      => $service->id,
                    'title'   => $service->title,
                    'galleries' => $service->galleries->map(fn($g) => [
                        'id'         => $g->id,
                        'title'      => $g->title,
                        'order'      => $g->order,
                        // Array de {id, url} — mismo formato que Gallery360 espera
                        'images'     => collect($g->images ?? [])
                            ->map(fn($path, $i) => [
                                'id'  => $i,
                                'url' => route('resource-gallery.image', [
                                    'gallery' => $g->id,
                                    'index'   => $i,
                                ]),
                            ])
                            ->values(),
                    ]),
                ];
            });

        return Inertia::render('Resource/Gallery/Viewer', [
            'services' => $services,
        ]);
    }
}
