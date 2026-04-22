<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessResourcePdfToImages;
use App\Models\Resource;
use App\Models\ResourcePage;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function index(): Response
    {
        $services = Service::with(['resources' => fn($q) => $q->orderBy('order')])
            ->whereHas('resources')
            ->get(['id', 'title', 'slug'])
            ->map(function ($service) {
                return [
                    'id'        => $service->id,
                    'title'     => $service->title,
                    'resources' => $service->resources->map(fn($r) => [
                        'id'          => $r->id,
                        'title'       => $r->title,
                        'order'       => $r->order,
                        'orientation' => $r->orientation,
                        'categories'  => $r->categories ?? [],
                        'pdf_url'     => route('resource.pdf', $r),
                    ]),
                ];
            });

        return Inertia::render('Resource/Design/List', [
            'services' => $services,
        ]);
    }

    public function create(): Response
    {
        $services = Service::select('id', 'title')->orderBy('title')->get();

        return Inertia::render('Resource/Design/Create', [
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id'   => 'required|exists:services,id',
            'title'        => 'nullable|string|max:255',
            'categories'   => 'nullable|array',
            'categories.*' => 'required|string',
            'order'        => 'nullable|integer',
            'orientation'  => 'required|in:vertical,horizontal',
            'pdf'          => 'required|file|mimes:pdf|max:102400',
        ]);

        $validated['pdf'] = $request->file('pdf')->store('resources', 'private');
        $validated['status'] = 'processing';

        $resource = Resource::create($validated);

        ProcessResourcePdfToImages::dispatch($resource);

        return redirect()->route('resource.index')->with('success', 'Recurso creado exitosamente, espere mientras se procesa el PDF.');
    }

    public function edit(Resource $resource): Response
    {
        $services = Service::select('id', 'title')->orderBy('title')->get();

        return Inertia::render('Resource/Design/Edit', [
            'resource' => $resource->load('service'),
            'services' => $services,
        ]);
    }

    public function update(Request $request, Resource $resource)
    {
        $validated = $request->validate([
            'service_id'   => 'required|exists:services,id',
            'title'        => 'nullable|string|max:255',
            'categories'   => 'nullable|array',
            'categories.*' => 'required|string',
            'order'        => 'nullable|integer',
            'orientation'  => 'required|in:vertical,horizontal',
            'pdf'          => 'nullable|file|mimes:pdf|max:102400',
        ]);

        if ($request->hasFile('pdf') && $request->file('pdf')->isValid()) {
            // 1. Borrar PDF viejo
            if ($resource->pdf && Storage::disk('private')->exists($resource->pdf)) {
                Storage::disk('private')->delete($resource->pdf);
            }

            // 2. Borrar imágenes WebP antiguas
            $folderPath = storage_path('app/private/resource_pages/' . $resource->id);
            if (file_exists($folderPath)) {
                \Illuminate\Support\Facades\File::deleteDirectory($folderPath);
            }

            // 3. Borrar registros de páginas en la BD
            $resource->pages()->delete();

            // 4. Guardar nuevo PDF y marcar como procesando
            $validated['pdf'] = $request->file('pdf')->store('resources', 'private');
            $validated['status'] = 'processing';

            $resource->update($validated);

            // 5. Despachar el job para generar las nuevas imágenes
            ProcessResourcePdfToImages::dispatch($resource);
        } else {
            unset($validated['pdf']);
            $resource->update($validated);
        }

        return redirect()->route('resource.index')
            ->with('success', 'Recurso actualizado exitosamente.');
    }

    public function destroy(Resource $resource)
    {
        // Borrar PDF
        if ($resource->pdf && Storage::disk('private')->exists($resource->pdf)) {
            Storage::disk('private')->delete($resource->pdf);
        }

        // Borrar carpeta de imágenes privadas
        $folderPath = storage_path('app/private/resource_pages/' . $resource->id);
        if (file_exists($folderPath)) {
            \Illuminate\Support\Facades\File::deleteDirectory($folderPath);
        }

        $resource->delete();

        return redirect()->route('resource.index')
            ->with('success', 'Recurso eliminado exitosamente.');
    }

    // Sirve una imagen de página de forma privada
    public function page(Resource $resource, ResourcePage $page)
    {
        // Verificar que la página pertenece al recurso
        if ($page->resource_id !== $resource->id) {
            abort(403);
        }

        $path = storage_path('app/private/' . $page->image_path);

        if (!file_exists($path)) {
            abort(404);
        }

        return response()->file($path, [
            'Content-Type'  => 'image/webp',
            'Cache-Control' => 'private, max-age=3600',
        ]);
    }

    // Sirve el PDF privado — solo autenticados
    public function pdf(Resource $resource)
    {
        $path = $resource->pdf;

        if (!$path || !Storage::disk('private')->exists($path)) {
            abort(404);
        }

        return response()->file(Storage::disk('private')->path($path), [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
        ]);
    }

    // Vista para usuarios — manda todo via Inertia, sin fetch separado
    public function viewer(): Response
    {
        $services = Service::with([
            'resources' => fn($q) => $q->orderBy('order'),
            'galleries' => fn($q) => $q->orderBy('order'),
        ])
            ->where(function ($q) {
                $q->whereHas('resources')
                    ->orWhereHas('galleries');
            })
            ->get(['id', 'title', 'slug', 'type'])
            ->map(function ($service) {
                return [
                    'id'        => $service->id,
                    'title'     => $service->title,
                    'resources' => $service->resources->map(fn($r) => [
                        'id'          => $r->id,
                        'title'       => $r->title,
                        'categories'  => $r->categories ?? [],
                        'orientation' => $r->orientation,
                        'order'       => $r->order,
                        'status'      => $r->status,
                        'page_urls'   => $r->pages->map(fn($p) => route('resource.page', [$r, $p]))->toArray(),
                        // 'pdf_url'     => route('resource.pdf', $r),
                    ]),
                    'galleries' => $service->galleries->map(fn($g) => [
                        'id'       => $g->id,
                        'title'    => $g->title,
                        'order'    => $g->order,
                        'kuula_id' => $g->kuula_id,
                    ]),
                ];
            });

        return Inertia::render('Resource/Resources', [
            'services' => $services,
        ]);
    }
}
