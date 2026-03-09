<?php

namespace App\Http\Controllers;

use App\Models\PublicProject;
use App\Services\PublicProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PublicProjectController extends Controller
{
    public function __construct(protected PublicProjectService $service) {}

    public function index(): Response
    {
        $projects = PublicProject::latest()->get()->map(function ($project) {
            return [
                'id'        => $project->id,
                'name'      => $project->name,
                'image_url' => $project->image_url,
                'status'    => $project->status,
            ];
        });

        return Inertia::render('PublicProject/List', [
            'projects' => $projects,
        ]);
    }

    public function list()
    {
        $projects = PublicProject::latest()->where('status', 'active')->get()->map(function ($project) {
            return [
                'id'        => $project->id,
                'name'      => $project->name,
                'image_url' => $project->image_url,
                'status'    => $project->status,
            ];
        });

        return response()->json(
            $projects
        );
    }

    public function create(): Response
    {
        return Inertia::render('PublicProject/Create');
    }

    public function store(Request $request)
    {
        Log::info($request->all());

        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
            'status' => 'required|in:active,disabled'
        ]);

        $this->service->store($validated, $request->file('image'));

        return redirect()->route('public-project.index');
    }

    public function edit(PublicProject $publicProject): Response
    {
        return Inertia::render('PublicProject/Edit', [
            'project' => [
                'id'        => $publicProject->id,
                'name'      => $publicProject->name,
                'status'    => $publicProject->status,
                'image_url' => $publicProject->image_url,
            ],
        ]);
    }

    public function update(Request $request, PublicProject $publicProject)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'status' => 'required|in:active,disabled'
        ]);

        $this->service->update(
            $publicProject,
            $validated,
            $request->hasFile('image') ? $request->file('image') : null
        );

        return redirect()->route('public-project.index');
    }

    public function destroy(PublicProject $publicProject)
    {
        Log::info("Eliminando proyecto público: " . $publicProject->name);
        $this->service->destroy($publicProject);

        return redirect()->route('public-project.index');
    }
}
