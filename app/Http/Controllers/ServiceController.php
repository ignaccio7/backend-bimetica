<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // Listar servicios paginando de 15 en 15
        $services = Service::paginate(5);

        return Inertia::render('Service/Design/List', [
            'services' => $services
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('Service/Design/Create', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Log::info($request);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'type' => 'required|string',
            'items' => 'nullable|array',
            'items.*.title' => 'required|string',
            'items.*.categories' => 'nullable|array',
            'items.*.categories.*' => 'required|string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'required|string',
            'image' => 'required|mimes:jpg,jpeg,png,webp',
        ]);


        $validated['image'] = $request->file('image')->store('services', 'public');


        Service::create($validated);

        return redirect()->route('service.index')
            ->with('success', 'Servicio creado correctamente.');
        // return redirect()->back()->with('sucess', 'Servicio creado');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        // imprimir service en el logger        
        Log::info($service);
        return Inertia::render('Service/Design/Edit', [
            'service' => $service
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, string $id)
    public function update(Request $request, Service $service)
    {
        Log::info("Ver mi request");
        Log::info($request);
        Log::info($request->hasFile('image'));

        // Filtrar items vacíos
        if ($request->has('items')) {
            $items = collect($request->items ?? [])->filter(function ($item) {
                return !empty($item['title']);
            })->map(function ($item) {
                $item['categories'] = collect($item['categories'] ?? [])->filter()->values()->all();
                return $item;
            })->values()->all();

            $request->merge(['items' => count($items) > 0 ? $items : null]);
        }

        // Filtrar benefits vacíos
        if ($request->has('benefits')) {
            $benefits = collect($request->benefits ?? [])->filter()->values()->all();
            $request->merge(['benefits' => count($benefits) > 0 ? $benefits : null]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'type' => 'required|string',
            'items' => 'nullable|array',
            'items.*.title' => 'required|string',
            'items.*.categories' => 'nullable|array',
            'items.*.categories.*' => 'required|string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'required|string',
            'image' => 'nullable|mimes:jpg,jpeg,png,webp',
        ]);

        if ($request->file('image') && $request->file('image')->isValid()) {

            // Borrar imagen anterior
            if ($service->image && Storage::disk('public')->exists($service->image)) {
                Storage::disk('public')->delete($service->image);
            }

            // Guardar nueva imagen
            $validated['image'] = $request->file('image')->store('services', 'public');
        } else {
            unset($validated['image']);
        }
        $service->update($validated);

        // return redirect()->back()->with('sucess', 'Servicio actualizado');
        return redirect()->route('service.index')
            ->with('success', 'Servicio actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        if ($service->image && Storage::disk('public')->exists($service->image)) {
            Storage::disk('public')->delete($service->image);
        }

        $service->delete();
        return redirect()->route('service.index')
            ->with('success', 'Servicio eliminado correctamente.');
    }

    public function list(string $type)
    {
        return response()->json(Service::where('type', $type)->get());
    }

    public function menu()
    {
        // options design -> solo obtener slug y title
        Log::info('✅ Menu de servicios');
        $design = Service::where('type', 'diseño')->get(['slug', 'title']);
        $construction = Service::where('type', 'construccion')->get(['slug', 'title']);


        Log::info($design);
        Log::info($construction);

        return response()->json([
            'design' => $design,
            'construction' => $construction
        ]);
    }
}
