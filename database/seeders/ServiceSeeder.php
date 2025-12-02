<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Service::factory()->count(10)->create();
        $services = [
            [
                'title' => 'Carpeta técnica',
                'slug' => 'carpeta-tecnica',
                'description' => 'Documentación completa que integra especificaciones, planos, memorias y normativas técnicas necesarias para la aprobación y ejecución de proyectos civiles.',
                'type' => 'diseño',
                'categories' => [
                    'Elaboración de memorias técnicas',
                    'Recolección de requisitos normativos',
                    'Planilla de cómputos métricos',
                    'Documentación para licencias',
                ],
                'benefits' => [
                    'Facilita aprobaciones municipales',
                    'Reduce errores en obra',
                    'Asegura cumplimiento normativo',
                    'Organiza toda la información técnica del proyecto',
                ],
                'image' => 'https://picsum.photos/640/480?random=1',
            ],
            [
                'title' => 'Diseño de planos',
                'slug' => 'planos',
                'description' => 'Desarrollo profesional de planos arquitectónicos, eléctricos, sanitarios y estructurales siguiendo estándares técnicos y normativos actualizados.',
                'type' => 'diseño',
                'categories' => [
                    'Planos arquitectónicos',
                    'Planos estructurales',
                    'Instalaciones sanitarias y eléctricas',
                    'Detalles constructivos',
                ],
                'benefits' => [
                    'Claridad total en la ejecución',
                    'Minimiza correcciones durante la obra',
                    'Cumple con requisitos municipales',
                    'Facilita la visualización del proyecto',
                ],
                'image' => 'https://picsum.photos/640/480?random=2',
            ],
            [
                'title' => 'Diseño de trámites',
                'slug' => 'tramites',
                'description' => 'Preparación de documentación técnica requerida para procesos administrativos como licencias de construcción, ampliaciones y regularizaciones.',
                'type' => 'diseño',
                'categories' => [
                    'Licencias de construcción',
                    'Aprobación de planos',
                    'Regularizaciones',
                    'Tramitación documental',
                ],
                'benefits' => [
                    'Ahorro de tiempo en procesos burocráticos',
                    'Menos rechazos en trámites',
                    'Seguimiento continuo del proceso',
                    'Cumplimiento completo de requisitos legales',
                ],
                'image' => 'https://picsum.photos/640/480?random=3',
            ],
            [
                'title' => 'Computo de proyectos',
                'slug' => 'computo',
                'description' => 'Desarrollo de computos de proyectos para gestión de proyectos y gestión de recursos.',
                'type' => 'diseño',
                'categories' => [
                    'Computos de proyectos',
                    'Gestión de recursos',
                    'Gestión de proyectos',
                ],
                'benefits' => [
                    'Facilidad de gestión de proyectos',
                    'Reducción de tiempo y costos',
                    'Mejora de la gestión de recursos',
                    'Mejora de la gestión de proyectos',
                ],
                'image' => 'https://picsum.photos/640/480?random=4',
            ],
            [
                'title' => 'Construcción de obras civiles',
                'slug' => 'construccion-de-obras-civiles',
                'description' => 'Ejecución completa de proyectos civiles garantizando calidad, supervisión y cumplimiento de estándares técnicos en cada etapa de la obra.',
                'type' => 'construccion',
                'categories' => [
                    'Construcción de cimientos',
                    'Estructuras de concreto',
                    'Instalaciones técnicas',
                    'Acabados y terminaciones',
                ],
                'benefits' => [
                    'Calidad garantizada desde inicio a fin',
                    'Supervisión profesional',
                    'Reducción de riesgos constructivos',
                    'Cumplimiento estricto de plazos',
                ],
                'image' => 'https://picsum.photos/640/480?random=4',
            ],
            [
                'title' => 'Remodelación',
                'slug' => 'remodelacion',
                'description' => 'Rediseño y adecuación de espacios interiores y exteriores para mejorar funcionalidad, estética y valor del inmueble.',
                'type' => 'construccion',
                'categories' => [
                    'Remodelación de interiores',
                    'Renovación de fachadas',
                    'Optimización de espacios',
                    'Mejoras estructurales',
                ],
                'benefits' => [
                    'Modernización del espacio',
                    'Mejora del confort y estética',
                    'Incrementa el valor del inmueble',
                    'Adaptación del espacio a nuevas necesidades',
                ],
                'image' => 'https://picsum.photos/640/480?random=5',
            ],
            [
                'title' => 'Obra completa – llave en mano',
                'slug' => 'obra-completa',
                'description' => 'Desarrollo integral del proyecto desde la planificación hasta la entrega final, asegurando un proceso sin complicaciones para el cliente.',
                'type' => 'construccion',
                'categories' => [
                    'Planificación y diseño',
                    'Construcción completa',
                    'Supervisión y control de calidad',
                    'Entrega final lista para uso',
                ],
                'benefits' => [
                    'Cero preocupaciones para el cliente',
                    'Gestión total del proyecto',
                    'Ahorro de tiempo y coordinación',
                    'Entrega garantizada con estándares profesionales',
                ],
                'image' => 'https://picsum.photos/640/480?random=6',
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
