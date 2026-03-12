<?php

namespace App\Http\Controllers;

use App\Models\Resource;
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
        $resources = Resource::with('service')
            ->orderBy('service_id')
            ->orderBy('order')
            ->paginate(10);

        return Inertia::render('Resource/Design/List', [
            'resources' => $resources,
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

        Resource::create($validated);

        return redirect()->back()->with('success', 'Recurso creado');
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
            if ($resource->pdf && Storage::disk('private')->exists($resource->pdf)) {
                Storage::disk('private')->delete($resource->pdf);
            }
            $validated['pdf'] = $request->file('pdf')->store('resources', 'private');
        } else {
            unset($validated['pdf']);
        }

        $resource->update($validated);

        return redirect()->route('resource.index');
    }

    public function destroy(Resource $resource)
    {
        if ($resource->pdf && Storage::disk('private')->exists($resource->pdf)) {
            Storage::disk('private')->delete($resource->pdf);
        }

        $resource->delete();

        return redirect()->route('resource.index');
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
        $services = Service::with(['resources' => function ($q) {
            $q->orderBy('order');
        }])
            ->whereHas('resources')
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
                        'pdf_url'     => route('resource.pdf', $r),
                    ]),
                ];
            });

        return Inertia::render('Resource/Resources', [
            'services' => $services,
        ]);
    }
}
