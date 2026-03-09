<?php

namespace App\Services;

use App\Models\PublicProject;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PublicProjectService
{
  /**
   * Guarda la imagen y crea el proyecto.
   */
  public function store(array $data, UploadedFile $image): PublicProject
  {
    $path = $image->store('public_projects', 'public');

    return PublicProject::create(array_merge($data, [
      'image_path' => $path
    ]));
  }

  /**
   * Actualiza nombre y opcionalmente reemplaza la imagen.
   */
  public function update(PublicProject $project, array $data, ?UploadedFile $image = null): PublicProject
  {
    if ($image) {
      // Eliminar imagen anterior
      Storage::disk('public')->delete($project->image_path);
      $data['image_path'] = $image->store('public_projects', 'public');
    }

    $project->update($data);

    return $project->fresh();
  }

  /**
   * Elimina la imagen del disco y el registro.
   */
  public function destroy(PublicProject $project): void
  {
    Storage::disk('public')->delete($project->image_path);
    $project->delete();
  }
}
