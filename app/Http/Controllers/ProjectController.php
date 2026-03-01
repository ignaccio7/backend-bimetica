<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
            ->select('id', 'title', 'slug', 'pdf_path', 'created_at')
            ->get();

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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'pdf' => 'required|file|mimes:pdf|max:102400', // 100MB
        ]);

        // Guardar PDF en carpeta privada
        $pdfPath = $request->file('pdf')->store('projects', 'private');

        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'pdf_path' => $pdfPath,
        ]);

        return redirect()
            ->route('project.list')
            ->with('success', 'Proyecto creado correctamente');
    }

    public function pdf(Project $project)
    {
        return response()->file(
            storage_path('app/private/' . $project->pdf_path)
        );
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
