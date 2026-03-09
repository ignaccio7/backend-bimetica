<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar la tabla primero (opcional)
        // Service::truncate();

        $services = [
            [
                'title' => 'Planos 2D',
                'slug' => 'solo-planos-2d',
                'description' => 'Desarrollo de la base técnica indispensable para cualquier edificación, proporcionando un plano claro y preciso que sirve como guía maestra para la ejecución en obra y la organización espacial.',
                'type' => 'diseño',
                'items' => [
                    [
                        'title' => 'Planos Técnicos',
                        'categories' => [
                            'Plantas arquitectónicas',
                            'Cortes longitudinales y transversales',
                            'Elevaciones detalladas en formatos AutoCAD y PDF',
                            'Esquema de fundaciones y planos de sitio y techos con sistema de desalojo de aguas pluviales y servidas',
                        ],
                    ],
                ],
                'benefits' => [
                    'Precisión Constructiva: Evita errores de interpretación en obra con medidas y niveles exactos.',
                    'Organización Técnica: Documentación estandarizada lista para ser consultada por cualquier profesional del área.',
                ],
                'image' => 'https://damassets.autodesk.net/content/dam/autodesk/draftr/23812/how-is-architecture-drawing-software-used-1172x660.jpeg',
            ],
            [
                'title' => 'Diseño de Interior',
                'slug' => 'diseno-de-interior',
                'description' => 'Propuesta estética y funcional que transforma los espacios internos en ambientes personalizados, optimizando cada metro cuadrado mediante el uso estratégico de materiales, luz y mobiliario.',
                'type' => 'diseño',
                'items' => [
                    [
                        'title' => 'Planificación Espacial',
                        'categories' => [
                            'Planos de Layout, plantas generales y elevaciones internas.',
                        ],
                    ],
                    [
                        'title' => 'Diseño de Detalles',
                        'categories' => [
                            'Planos de iluminación, cielos falsos y detalles constructivos de mobiliario a medida.',
                        ],
                    ],
                    [
                        'title' => 'Conceptualización',
                        'categories' => [
                            'Entrega de Moodboard (paleta de colores y texturas) y renders 3D detallados para visualización final.',
                        ],
                    ],
                ],
                'benefits' => [
                    'Personalización Total: Espacios diseñados exclusivamente para tu estilo de vida o identidad de marca.',
                    'Optimización de Presupuesto: Selección previa de materiales y acabados que evitan compras innecesarias.',
                ],
                'image' => 'https://images.griddo.udit.es/c/cover/q/70/w/1920/h/1080/p/center/f/jpeg/blog-diseno-de-interiores-271025-8a64a90f-23c3-4146-95f6-4916d98a9b26',
            ],
            [
                'title' => 'Estudio de Suelos',
                'slug' => 'estudio-suelos',
                'description' => 'Análisis científico y técnico del terreno para determinar su capacidad de carga y comportamiento, garantizando que la estructura se diseñe sobre bases sólidas y seguras.',
                'type' => 'diseño',
                'items' => [
                    [
                        'title' => 'Análisis de Campo',
                        'categories' => [
                            'Ejecución de calicatas o sondeos y toma de muestras.',
                        ],
                    ],
                    [
                        'title' => 'Laboratorio',
                        'categories' => [
                            'Informe detallado de laboratorio de suelos con propiedades físicas y mecánicas.',
                        ],
                    ],
                    [
                        'title' => 'Certificación',
                        'categories' => [
                            'Formulario resumen de estudio geológico-geotécnico y respaldo profesional legalizado.',
                        ],
                    ],
                ],
                'benefits' => [
                    'Seguridad Estructural: Prevención de asentamientos, grietas o fallas catastróficas en la edificación.',
                    'Ahorro en Cimientos: Permite diseñar la cimentación justa y necesaria sin sobredimensionar costos.',
                ],
                'image' => 'https://usil-blog.s3.amazonaws.com/PROD/blog/image/planos-arquitectura.jpg',
            ],
            [
                'title' => 'Cálculo Estructural',
                'slug' => 'calculo-estructural',
                'description' => 'Ingeniería de alta precisión dedicada al diseño de los elementos portantes de la edificación, asegurando la estabilidad y resistencia del proyecto ante cargas vivas, muertas y eventos sísmicos.',
                'type' => 'diseño',
                'items' => [
                    [
                        'title' => 'Diseño Estructural',
                        'categories' => [
                            'Planos de vigas, columnas, losas, muros y escaleras.',
                        ],
                    ],
                    [
                        'title' => 'Documentación Técnica',
                        'categories' => [
                            'Memorias de cálculo estructural y plan de contingencias.',
                        ],
                    ],
                    [
                        'title' => 'Validez Legal',
                        'categories' => [
                            'Formularios de resumen de cálculo y credenciales profesionales para trámites municipales.',
                        ],
                    ],
                ],
                'benefits' => [
                    'Tranquilidad y Garantía: Estructuras que cumplen con las normas de seguridad vigentes.',
                    'Eficiencia de Materiales: Uso optimizado de acero y hormigón para reducir costos sin comprometer la resistencia.',
                ],
                'image' => 'https://images.homify.com/v1540327099/p/photo/image/2761639/fyhny.jpg',
            ],
            [
                'title' => 'Planos Eléctricos e Hidrosanitarios',
                'slug' => 'planos-electricos-hidrosanitarios',
                'description' => 'Diseño de las redes vitales del edificio, enfocándose en la eficiencia energética, el confort del usuario y el suministro constante de servicios básicos.',
                'type' => 'diseño',
                'items' => [
                    [
                        'title' => 'Red Eléctrica',
                        'categories' => [
                            'Circuitos de iluminación, tomacorrientes, cuadros de carga, diagramas unifilares y sistemas especiales (domótica/sonido).',
                        ],
                    ],
                    [
                        'title' => 'Red Hidrosanitaria',
                        'categories' => [
                            'Planos de agua fría, agua caliente, desagües, isométricos y memorias de cálculo de presión.',
                        ],
                    ],
                ],
                'benefits' => [
                    'Funcionalidad Sin Fallas: Sistemas diseñados para evitar sobrecargas eléctricas o problemas de presión de agua.',
                    'Facilidad de Mantenimiento: Ubicación exacta de cada tubería y cableado para reparaciones futuras sencillas.',
                ],
                'image' => 'https://images.homify.com/v1540327099/p/photo/image/2761639/fyhny.jpg',
            ],
            [
                'title' => 'Cómputo y Presupuesto de Obra',
                'slug' => 'computo-y-presupuesto-de-obra',
                'description' => 'Análisis financiero y cuantificación detallada de todos los recursos necesarios para la construcción, brindando transparencia y control total sobre la inversión.',
                'type' => 'diseño',
                'items' => [
                    [
                        'title' => 'Cuantificación',
                        'categories' => [
                            'Cómputos métricos detallados por cada ítem de obra.',
                        ],
                    ],
                    [
                        'title' => 'Análisis Económico',
                        'categories' => [
                            'Análisis de Precios Unitarios (APU) y presupuesto general consolidado.',
                        ],
                    ],
                    [
                        'title' => 'Resumen Ejecutivo',
                        'categories' => [
                            'Resumen general de inversión.',
                        ],
                    ],
                ],
                'benefits' => [
                    'Control Financiero: Evita fugas de capital y sorpresas económicas durante la construcción.',
                    'Planificación de Compras: Permite programar la adquisición de materiales de manera inteligente.',
                ],
                'image' => 'https://images.homify.com/v1540327099/p/photo/image/2761639/fyhny.jpg',
            ],
            [
                'title' => 'Trámites Municipales',
                'slug' => 'tramites-municipales',
                'description' => 'Gestión administrativa profesional para la regularización legal de tu proyecto, asegurando que todos los permisos de construcción estén en orden ante las autoridades locales.',
                'type' => 'diseño',
                'items' => [
                    [
                        'title' => 'Gestión Documental',
                        'categories' => [
                            'Llenado de formularios y subida de archivos al sistema de la Alcaldía.',
                        ],
                    ],
                    [
                        'title' => 'Seguimiento',
                        'categories' => [
                            'Subsanación de observaciones técnicas en planos y control del proceso de trámite.',
                        ],
                    ],
                    [
                        'title' => 'Finalización',
                        'categories' => [
                            'Entrega oficial del permiso de construcción aprobado.',
                        ],
                    ],
                ],
                'benefits' => [
                    'Ahorro de Tiempo: Nosotros nos encargamos de la burocracia para que tú te enfoques en disfrutar tu proyecto.',
                    'Respaldo Legal: Construcción protegida contra multas o paralizaciones por falta de permisos.',
                ],
                'image' => 'https://images.homify.com/v1540327099/p/photo/image/2761639/fyhny.jpg',
            ],
            [
                'title' => 'Obra Gruesa',
                'slug' => 'obra-gruesa',
                'description' => 'Representa la etapa medular del proyecto donde se consolida la estabilidad y la forma estructural de la edificación, siguiendo rigurosamente las especificaciones de ingeniería.',
                'type' => 'construccion',
                'items' => [
                    [
                        'title' => 'Fundaciones y Estructura',
                        'categories' => [
                            'Ejecución de zapatas, vigas de fundación, columnas y losas conforme al cálculo estructural.',
                        ],
                    ],
                    [
                        'title' => 'Levantamiento de Muros',
                        'categories' => [
                            'Construcción de muros portantes y tabiquería de cierre según la planimetría.',
                        ],
                    ],
                    [
                        'title' => 'Cubiertas y Techumbres',
                        'categories' => [
                            'Instalación de estructuras de techo y sistemas de impermeabilización básica.',
                        ],
                    ],
                    [
                        'title' => 'Instalaciones Embutidas',
                        'categories' => [
                            'Colocación de ductería primaria para servicios eléctricos e hidrosanitarios.',
                        ],
                    ],
                ],
                'benefits' => [
                    'Solidez Garantizada: Estructuras ejecutadas bajo normas de seguridad que aseguran la vida útil del inmueble.',
                    'Base para Acabados: Entrega de superficies niveladas y plomadas, facilitando la posterior etapa de terminaciones.',
                ],
                'image' => 'https://images.homify.com/v1540327099/p/photo/image/2761639/fyhny.jpg',
            ],
            [
                'title' => 'Obra Fina',
                'slug' => 'obra-fina',
                'description' => 'Etapa de personalización y detalle donde se aplican los revestimientos y acabados finales que definen la estética, el confort y la funcionalidad de cada ambiente.',
                'type' => 'construccion',
                'items' => [
                    [
                        'title' => 'Revestimientos y Pisos',
                        'categories' => [
                            'Colocación de cerámicas, porcelanatos, revoques de yeso y acabados de pintura.',
                        ],
                    ],
                    [
                        'title' => 'Cielos y Carpintería',
                        'categories' => [
                            'Instalación de cielos falsos, puertas, ventanas y detalles de carpintería fina.',
                        ],
                    ],
                    [
                        'title' => 'Terminaciones Técnicas',
                        'categories' => [
                            'Instalación de luminarias, piezas sanitarias, griferías y accesorios eléctricos finales.',
                        ],
                    ],
                    [
                        'title' => 'Detalles de Diseño',
                        'categories' => [
                            'Ejecución de acabados especiales según el proyecto de diseño de interiores.',
                        ],
                    ],
                ],
                'benefits' => [
                    'Estética Superior: Transformación visual del proyecto con materiales de alta calidad y mano de obra especializada.',
                    'Habitabilidad Inmediata: Espacios listos para el uso cotidiano con instalaciones totalmente funcionales.',
                ],
                'image' => 'https://images.homify.com/v1540327099/p/photo/image/2761639/fyhny.jpg',
            ],
            [
                'title' => 'Obra Completa (Llave en Mano)',
                'slug' => 'obra-completa',
                'description' => 'Es nuestra solución integral de gestión total, donde asumimos la responsabilidad absoluta desde la excavación inicial hasta la limpieza final de entrega.',
                'type' => 'construccion',
                'items' => [
                    [
                        'title' => 'Gestión 360°',
                        'categories' => [
                            'Ejecución secuencial y coordinada de la Obra Gruesa y la Obra Fina sin interrupciones.',
                        ],
                    ],
                    [
                        'title' => 'Administración de Recursos',
                        'categories' => [
                            'Control de presupuestos, compra de materiales y supervisión de personal especializado.',
                        ],
                    ],
                    [
                        'title' => 'Control de Calidad',
                        'categories' => [
                            'Verificación constante de cada hito constructivo para asegurar la fidelidad al diseño original.',
                        ],
                    ],
                    [
                        'title' => 'Entrega Final',
                        'categories' => [
                            'Limpieza profunda de obra y entrega oficial de las llaves del proyecto terminado.',
                        ],
                    ],
                ],
                'benefits' => [
                    'Cero Estrés: El cliente delega toda la complejidad técnica y operativa en un solo equipo responsable.',
                    'Optimización de Tiempos: Reducción de plazos de entrega al evitar baches logísticos entre diferentes contratistas.',
                ],
                'image' => 'https://images.homify.com/v1540327099/p/photo/image/2761639/fyhny.jpg',
            ],
        ];

        // Insertar todos los servicios
        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
