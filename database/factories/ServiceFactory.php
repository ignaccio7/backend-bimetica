<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['diseño', 'construccion'];

        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'type' => fake()->randomElement($types),
            'categories' => json_encode(fake()->sentences(3)),
            'benefits' => json_encode(fake()->sentences(3)),
            'image' => 'https://picsum.photos/640/480?random=' . rand(1, 1000),

        ];
    }
}
