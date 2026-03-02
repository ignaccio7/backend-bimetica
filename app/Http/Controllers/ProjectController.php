<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        return Inertia::render('Project/Index', []);
    }

    public function list()
    {
        $projects = Project::latest()
            ->select('id', 'title', 'slug', 'pdf_path', 'gallery_equirectangular', 'orientation', 'category', 'status', 'created_at')
            ->get()
            ->map(function ($project) {
                return [
                    'id'                      => $project->id,
                    'title'                   => $project->title,
                    'slug'                    => $project->slug,
                    'category'                => $project->category,
                    'status'                  => $project->status,
                    'orientation'             => $project->orientation,
                    'pdf_path'                => $project->pdf_path,
                    'gallery_equirectangular' => $project->gallery_equirectangular ?? [],
                    'gallery_count'           => count($project->gallery_equirectangular ?? []),
                    'created_at'              => $project->created_at,
                ];
            });

        return Inertia::render('Project/List', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Project/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'                    => 'required|string|max:255|unique:projects,title',
            'description'              => 'nullable|string',
            'category'                 => 'nullable|string|max:255',
            'image'                    => 'nullable|image|max:20480',
            'status'                   => 'nullable|string|max:255',
            'characteristics'          => 'nullable|string',
            'orientation'              => 'required|in:horizontal,vertical',
            'pdf'                      => 'nullable|file|mimes:pdf|max:102400',
            'gallery_equirectangular'  => 'nullable|array',
            'gallery_equirectangular.*' => 'file|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        // Guardar la imagen principal
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')
                ->store('projects/cover', 'private');
        }

        // Guardar PDF
        $pdfPath = null;
        if ($request->hasFile('pdf')) {
            $pdfPath = $request->file('pdf')->store('projects', 'private');
        }

        // Guardar imágenes de galería equirectangular
        $galleryPaths = [];
        if ($request->hasFile('gallery_equirectangular')) {
            foreach ($request->file('gallery_equirectangular') as $image) {
                $galleryPaths[] = $image->store('projects/images', 'private');
            }
        }

        // Parsear características (vienen como JSON string desde el form)
        $characteristics = null;
        if ($request->filled('characteristics')) {
            $characteristics = json_decode($request->characteristics, true);
        }

        Project::create([
            'title'                   => $request->title,
            'description'             => $request->description,
            'category'                => $request->category,
            'status'                  => $request->status ?? 'En proceso',
            'characteristics'         => $characteristics,
            'orientation'             => $request->orientation,
            'image_path'              => $imagePath,
            'pdf_path'                => $pdfPath,
            'gallery_equirectangular' => $galleryPaths ?: null,
        ]);

        return redirect()
            ->route('project.list')
            ->with('success', 'Proyecto creado correctamente');
    }

    public function pdf(Project $project)
    {
        $path = $project->pdf_path;

        if (!$path || !Storage::disk('private')->exists($path)) {
            abort(404);
        }

        $fullPath = Storage::disk('private')->path($path);

        return response()->file($fullPath, [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
        ]);
    }

    public function cover(Project $project)
    {
        $path = $project->image_path;

        if (!$path || !Storage::disk('private')->exists($path)) {
            abort(404);
        }

        return response()->file(Storage::disk('private')->path($path), [
            'Content-Type' => 'image/jpeg',
        ]);
    }

    public function galleryImage(Project $project, int $index)
    {
        $gallery = $project->gallery_equirectangular ?? [];

        if (!isset($gallery[$index])) abort(404);

        $path = $gallery[$index];

        if (!Storage::disk('private')->exists($path)) abort(404);

        return response()->file(Storage::disk('private')->path($path));
    }

    /**
     * Display the specified resource.
     */
    public function show($project)
    {
        Log::info($project);
        return Inertia::render('Project/Show', [
            'project' => $project
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return Inertia::render('Project/Edit', [
            'project' => [
                'id'              => $project->id,
                'title'           => $project->title,
                'slug'            => $project->slug,
                'description'     => $project->description,
                'category'        => $project->category,
                'status'          => $project->status,
                'orientation'     => $project->orientation,
                'characteristics' => $project->characteristics,
                'pdf_path'        => $project->pdf_path,
                'image_path'      => $project->image_path,
                'gallery_equirectangular' => $project->gallery_equirectangular ?? [],
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $request->validate([
            'title'                    => [
                'required',
                'string',
                'max:255',
                Rule::unique('projects', 'title')->ignore($project->id),
            ],
            'description'              => 'nullable|string',
            'category'                 => 'nullable|string|max:255',
            'status'                   => 'nullable|string|max:255',
            'characteristics'          => 'nullable|string',
            'orientation'              => 'required|in:horizontal,vertical',
            'image'                    => 'nullable|image|max:20480',
            'pdf'                      => 'nullable|file|mimes:pdf|max:102400',
            'gallery_equirectangular'  => 'nullable|array',
            'gallery_equirectangular.*' => 'file|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        /* ===== IMAGEN PRINCIPAL ===== */
        if ($request->hasFile('image')) {
            if (
                $project->image_path &&
                Storage::disk('private')->exists($project->image_path)
            ) {
                Storage::disk('private')->delete($project->image_path);
            }

            $project->image_path = $request->file('image')
                ->store('projects/cover', 'private');
        }

        /* ===== PDF ===== */
        if ($request->hasFile('pdf')) {

            // borrar anterior si existe
            if ($project->pdf_path && Storage::disk('private')->exists($project->pdf_path)) {
                Storage::disk('private')->delete($project->pdf_path);
            }

            $project->pdf_path = $request->file('pdf')->store('projects', 'private');
        }

        /* ===== GALERÍA ===== */
        $galleryPaths = $project->gallery_equirectangular ?? [];

        if ($request->hasFile('gallery_equirectangular')) {
            foreach ($request->file('gallery_equirectangular') as $image) {
                $galleryPaths[] = $image->store('projects/images', 'private');
            }
        }

        /* ===== CARACTERÍSTICAS ===== */
        $characteristics = null;
        if ($request->filled('characteristics')) {
            $characteristics = json_decode($request->characteristics, true);
        }

        $project->update([
            'title'                   => $request->title,
            'description'             => $request->description,
            'image_path'              => $project->image_path,
            'category'                => $request->category,
            'status'                  => $request->status,
            'orientation'             => $request->orientation,
            'characteristics'         => $characteristics,
            'gallery_equirectangular' => $galleryPaths ?: null,
        ]);

        return redirect()
            ->route('project.list')
            ->with('success', 'Proyecto actualizado correctamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        // Borrar imagen principal
        if (
            $project->image_path &&
            Storage::disk('private')->exists($project->image_path)
        ) {
            Storage::disk('private')->delete($project->image_path);
        }

        // Borrar PDF privado
        if ($project->pdf_path && Storage::disk('private')->exists($project->pdf_path)) {
            Storage::disk('private')->delete($project->pdf_path);
        }

        // Borrar galería pública
        if ($project->gallery_equirectangular) {
            foreach ($project->gallery_equirectangular as $image) {
                if (Storage::disk('private')->exists($image)) {
                    Storage::disk('private')->delete($image);
                }
            }
        }

        $project->delete();

        return redirect()
            ->route('project.list')
            ->with('success', 'Proyecto eliminado correctamente');
    }
}
