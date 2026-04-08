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
        $projects = Project::latest()
            ->get()
            ->map(fn($p) => [
                'slug'            => $p->slug,
                'title'           => $p->title,
                'description'     => $p->description,
                'category'        => $p->category,
                'status'          => $p->status,
                'pdf_path'        => $p->pdf_path,
                'characteristics' => $p->characteristics ?? [],
                'created_at'      => $p->created_at,
                'cover_url'       => $p->image_path
                    ? route('project.cover', $p)
                    : null,
            ]);

        return Inertia::render('Project/Index', ['projects' => $projects]);
    }

    public function resources()
    {
        return Inertia::render('Project/Resources');
    }

    public function list()
    {
        Log::info('Mostrando lista de proyectos');
        $projects = Project::latest()
            ->select('id', 'title', 'slug', 'pdf_path', 'kuula_id', 'orientation', 'category', 'status', 'created_at')
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
                    'kuula_id'                => $project->kuula_id,
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
            'kuula_id'                 => 'nullable|string|max:255',
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
            'kuula_id'                => $request->kuula_id,
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

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $project = Project::where('slug', $slug)->firstOrFail();

        return Inertia::render('Project/Show', [
            'project' => [
                'slug'            => $project->slug,
                'title'           => $project->title,
                'description'     => $project->description,
                'category'        => $project->category,
                'status'          => $project->status,
                'orientation'     => $project->orientation,
                'characteristics' => $project->characteristics ?? [],
                'cover_url'       => $project->image_path
                    ? route('project.cover', $project->slug)
                    : null,
                'pdf_url'         => $project->pdf_path
                    ? route('project.pdf', $project->slug)
                    : null,
                'kuula_id'        => $project->kuula_id,
            ],
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
                'kuula_id'        => $project->kuula_id,
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
            'kuula_id'                 => 'nullable|string|max:255',
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
            'kuula_id'                => $request->kuula_id,
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

        $project->delete();

        return redirect()
            ->route('project.list')
            ->with('success', 'Proyecto eliminado correctamente');
    }
}
