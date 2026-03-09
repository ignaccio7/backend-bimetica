<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PublicProject extends Model
{
    use HasFactory;

    protected $table = 'public_projects';

    protected $fillable = [
        'name',
        'image_path',
        'status',
    ];

    /**
     * Devuelve la URL pública de la imagen
     */
    public function getImageUrlAttribute(): string
    {
        return asset('storage/' . $this->image_path);
    }
}
