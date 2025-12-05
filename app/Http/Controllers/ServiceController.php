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
            'description' => 'required|string',
            'type' => 'required|string',
            'categories' => 'nullable|array',
            'categories.*' => 'required|string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'required|string',
            'image' => 'required|mimes:jpg,jpeg,png,webp|max:5120',
        ]);


        $validated['image'] = $request->file('image')->store('services', 'public');


        Service::create($validated);

        return redirect()->back()->with('sucess', 'Servicio creado');
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
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string',
            'categories' => 'nullable|array',
            'categories.*' => 'required|string',
            'benefits' => 'nullable|array',
            'benefits.*' => 'required|string',
            'image' => 'nullable|mimes:jpg,jpeg,png,webp|max:5120',
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
        return redirect()->route('service.index');
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
        return redirect()->route('service.index');
    }

    public function list(string $type)
    {
        return response()->json(Service::where('type', $type)->get());
    }
}
