<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
            'status'                   => 'nullable|string|max:255',
            'characteristics'          => 'nullable|string', // viene como JSON string
            'orientation'              => 'required|in:horizontal,vertical',
            'pdf'                      => 'nullable|file|mimes:pdf|max:102400',
            'gallery_equirectangular'  => 'nullable|array',
            'gallery_equirectangular.*' => 'file|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        // Guardar PDF
        $pdfPath = null;
        if ($request->hasFile('pdf')) {
            $pdfPath = $request->file('pdf')->store('projects', 'private');
        }

        // Guardar imágenes de galería equirectangular
        $galleryPaths = [];
        if ($request->hasFile('gallery_equirectangular')) {
            foreach ($request->file('gallery_equirectangular') as $image) {
                $galleryPaths[] = $image->store('projects/gallery', 'public');
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        //
    }
}
