<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resource extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'categories' => 'array',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
