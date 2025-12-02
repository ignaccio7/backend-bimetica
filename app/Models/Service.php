<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    // protected $fillable = ['title', 'description', 'type', 'categories', 'benefits', 'image'];

    protected $guarded = [];

    protected $casts = [
        'categories' => 'array',
        'benefits' => 'array'
    ];
}
