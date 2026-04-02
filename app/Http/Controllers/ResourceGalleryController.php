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
                    'id'       => $service->id,
                    'title'    => $service->title,
                    'galleries' => $service->galleries->map(fn($g) => [
                        'id'       => $g->id,
                        'title'    => $g->title,
                        'order'    => $g->order,
                        'kuula_id' => $g->kuula_id,
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
            'kuula_id'   => 'required|string|max:255',
        ]);

        ResourceGallery::create([
            'service_id' => $request->service_id,
            'title'      => $request->title,
            'order'      => $request->order ?? 0,
            'kuula_id'   => $request->kuula_id,
        ]);

        return redirect()->route('resource-gallery.index')
            ->with('success', 'Galería creada');
    }

    public function edit(ResourceGallery $resourceGallery): Response
    {
        $services = Service::select('id', 'title')->orderBy('title')->get();

        return Inertia::render('Resource/Gallery/Edit', [
            'gallery'  => [
                'id'         => $resourceGallery->id,
                'service_id' => $resourceGallery->service_id,
                'title'      => $resourceGallery->title,
                'order'      => $resourceGallery->order,
                'kuula_id'   => $resourceGallery->kuula_id,
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
            'kuula_id'   => 'required|string|max:255',
        ]);

        $resourceGallery->update([
            'service_id' => $request->service_id,
            'title'      => $request->title,
            'order'      => $request->order ?? 0,
            'kuula_id'   => $request->kuula_id,
        ]);

        return redirect()->route('resource-gallery.index')
            ->with('success', 'Galería actualizada exitosamente.');
    }

    public function destroy(ResourceGallery $resourceGallery)
    {
        $resourceGallery->delete();

        return redirect()->route('resource-gallery.index')
            ->with('success', 'Galería eliminada exitosamente.');
    }

    // Vista usuario — agrupa por servicio
    public function viewer(): Response
    {
        $services = Service::with(['galleries' => fn($q) => $q->orderBy('order')])
            ->whereHas('galleries')
            ->get(['id', 'title', 'slug'])
            ->map(function ($service) {
                return [
                    'id'       => $service->id,
                    'title'    => $service->title,
                    'galleries' => $service->galleries->map(fn($g) => [
                        'id'       => $g->id,
                        'title'    => $g->title,
                        'order'    => $g->order,
                        'kuula_id' => $g->kuula_id,
                    ]),
                ];
            });

        return Inertia::render('Resource/Gallery/Viewer', [
            'services' => $services,
        ]);
    }
}
