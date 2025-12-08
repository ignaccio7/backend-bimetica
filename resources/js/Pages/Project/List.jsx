import { IconCalendar, IconClock, IconLocation } from "@/Icons/icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useRef, useState } from "react";
import Shuffle from "shufflejs";

export default function ProjectsList({ projects = [] }) {
    const projectsDB = [
        {
            title: "Torre Residencial Moderna - Santa Cruz",
            description:
                "Edificio residencial de alta gama que combina lujo y sostenibilidad en el corazón de la zona este de Santa Cruz, incorporando elementos arquitectónicos inspirados en la cultura chiquitana.",
            category: "Infraestructura",
            status: "Completado",
            tags: {
                location: "Santa Cruz de la Sierra",
                area: "18,500 m²",
                duration: "28 meses",
                estimation: "$18,500,000 USD",
                year: 2022,
                architect: "Arq. Carlos Mendez",
            },
            characteristics: [
                "150 apartamentos de 1 a 4 dormitorios",
                "Certificación EDGE del IFC",
                "Sistema de ventilación natural cruzada",
                "Fachada con cerámica local de Cotoca",
                "Sky lounge con vista al Parque Urbano",
                "Piscina climatizada con techos retráctiles",
                "Jardines con flora autóctona cruceña",
                "Centro de negocios y salas de reuniones",
            ],
            challenges: [
                "Suelos expansivos típicos de Santa Cruz",
                "Altas temperaturas y humedad ambiental",
                "Integración con la red eléctrica local",
                "Control de inundaciones en época de lluvias",
            ],
            solutions: [
                "Cimentación especial con pilotes helicoidales",
                "Doble fachada con cámara de aire ventilada",
                "Paneles solares y sistema de respaldo energético",
                "Sistema de drenaje pluvial con estanques de retención",
            ],
            gallery_equirectangular: [
                "torre_santa_cruz_1",
                "torre_santa_cruz_2",
                "torre_santa_cruz_3",
            ],
            gallery_images: ["3d_torre_1", "3d_torre_2", "3d_torre_3"],
        },
        {
            title: "Hospital Oncológico Nacional - La Paz",
            description:
                "Centro médico especializado de referencia nacional ubicado en El Alto, que integra medicina tradicional aymara con tecnología de punta en un diseño bioclimático adaptado a la altura.",
            category: "Salud",
            status: "En construcción",
            tags: {
                location: "El Alto, La Paz",
                area: "45,000 m²",
                duration: "36 meses",
                estimation: "$65,000,000 USD",
                year: 2024,
                architect: "Arq. Lucía Quispe",
            },
            characteristics: [
                "250 camas de hospitalización",
                "12 quirófanos de última generación",
                "Centro de medicina nuclear",
                "Unidad de terapia hiperbárica",
                "Jardines terapéuticos con plantas medicinales andinas",
                "Sistema de telemedicina satelital",
                "Centro de investigación oncológica",
                "Capilla interreligiosa y espacio para rituales tradicionales",
            ],
            challenges: [
                "Baja presión atmosférica (4,000 msnm)",
                "Temperaturas extremas día/noche",
                "Acceso a tecnología médica especializada",
                "Conexión a servicios básicos en zona periurbana",
            ],
            solutions: [
                "Sistema de oxígeno medicalizado centralizado",
                "Muros Trombe y invernaderos solares para calefacción pasiva",
                "Alianza con cooperación internacional para equipamiento",
                "Planta propia de tratamiento de agua y generación eléctrica",
            ],
            gallery_equirectangular: ["hospital_paz_1", "hospital_paz_2"],
            gallery_images: ["3d_hospital_1", "3d_hospital_2", "3d_hospital_3"],
        },
        {
            title: "Centro Cultural Tiwanaku - Copacabana",
            description:
                "Complejo museográfico y de investigación dedicado a la cultura Tiwanaku, ubicado en las riberas del Lago Titicaca, que reinterpreta la arquitectura precolombina con técnicas contemporáneas.",
            category: "Cultural",
            status: "Completado",
            tags: {
                location: "Copacabana, La Paz",
                area: "12,000 m²",
                duration: "22 meses",
                estimation: "$12,000,000 USD",
                year: 2021,
                architect: "Arq. Julio Condori",
            },
            characteristics: [
                "Museo con sala de realidad virtual inmersiva",
                "Biblioteca especializada en culturas andinas",
                "Anfiteatro al aire libre para 800 personas",
                "Talleres de cerámica y textiles tradicionales",
                "Restaurante con gastronomía altiplánica",
                "Observatorio astronómico con tecnología prehispánica",
                "Alojamiento para investigadores",
                "Jardines botánicos con especies nativas",
            ],
            challenges: [
                "Protección del patrimonio arqueológico circundante",
                "Condiciones climáticas extremas del altiplano",
                "Integración con el paisaje sagrado del lago",
                "Uso limitado de materiales modernos por normativa",
            ],
            solutions: [
                "Cimentación flotante que no afecta estratos arqueológicos",
                "Sistema de calefacción geotérmica utilizando el lago",
                "Diseño que sigue la topografía natural",
                "Uso de piedra local y adobe estabilizado",
            ],
            gallery_equirectangular: ["tiwanaku_1", "tiwanaku_2", "tiwanaku_3"],
            gallery_images: ["3d_cultural_1", "3d_cultural_2"],
        },
        {
            title: "Planta de Procesamiento de Quinua - Oruro",
            description:
                "Complejo industrial ecoeficiente para el procesamiento y valor agregado de quinua real, incorporando tecnología de punta con arquitectura inspirada en los salares de Uyuni.",
            category: "Salud",
            status: "Completado",
            tags: {
                location: "Salinas de Garci Mendoza, Oruro",
                area: "8,500 m²",
                duration: "18 meses",
                estimation: "$8,200,000 USD",
                year: 2020,
                architect: "Arq. Fernando Morales",
            },
            characteristics: [
                "Capacidad de procesamiento: 50 toneladas/día",
                "Sistema de limpieza y clasificación óptica",
                "Planta de empaque al vacío automatizada",
                "Laboratorio de control de calidad certificado",
                "Oficinas administrativas",
                "Alojamiento para 40 trabajadores",
                "Centro de capacitación para productores locales",
                "Sistema de energía solar y eólica híbrida",
            ],
            challenges: [
                "location remota con acceso limitado a servicios",
                "Altitud (3,800 msnm) afecta maquinaria",
                "Manejo de subproductos de forma sostenible",
                "Protección contra vientos salinos",
            ],
            solutions: [
                "Diseño modular prefabricado para fácil transporte",
                "Maquinaria adaptada para alta montaña",
                "Sistema de compostaje de desechos orgánicos",
                "Fachadas curvas que desvían los vientos predominantes",
            ],
            gallery_equirectangular: ["quinua_1", "quinua_2"],
            gallery_images: ["3d_planta_1", "3d_planta_2", "3d_planta_3"],
        },
        {
            title: "Edificio Corporativo YPFB - Cochabamba",
            description:
                "Sede regional de Yacimientos Petrolíferos Fiscales Bolivianos que refleja la identidad energética del país a través de un diseño dinámico y sostenible en el valle cochabambino.",
            category: "Institucional",
            status: "En construcción",
            tags: {
                location: "Cochabamba",
                area: "25,000 m²",
                duration: "30 meses",
                estimation: "$32,000,000 USD",
                year: 2024,
                architect: "Arq. Patricia Rojas",
            },
            characteristics: [
                "20 pisos con vista al Parque de la Familia",
                "Atrio central de 6 pisos con jardín vertical",
                "Sistema de domótica integral",
                "Estacionamiento robotizado para 400 vehículos",
                "Centro de convenciones para 1,200 personas",
                "Gimnasio y spa corporativo",
                "Restaurante giratorio en última planta",
                "Helipuerto de emergencia",
            ],
            challenges: [
                "Sismicidad moderada de la región",
                "Integración con sistema de transporte público",
                "Eficiencia energética en clima templado-cálido",
                "Seguridad exigente por naturaleza de la empresa",
            ],
            solutions: [
                "Estructura sismorresistente con disipadores de energía",
                "Conexión directa con sistema de teleférico",
                "Fachada ventilada con persianas inteligentes",
                "Sistema de control de acceso biométrico multicapa",
            ],
            gallery_equirectangular: ["ypfb_1", "ypfb_2"],
            gallery_images: [
                "3d_corporativo_1",
                "3d_corporativo_2",
                "3d_corporativo_3",
            ],
        },
        {
            title: "Complejo Turístico Eco-Lodge - Rurrenabaque",
            description:
                "Conjunto de cabañas de lujo sostenible en la Amazonía boliviana, diseñadas para la observación de biodiversidad con mínimo impacto ambiental y colaboración comunitaria.",
            category: "Institucional",
            status: "Completado",
            tags: {
                location: "Rurrenabaque, Beni",
                area: "15 hectáreas",
                duration: "14 meses",
                estimation: "$4,500,000 USD",
                year: 2022,
                architect: "Arq. Miguel Ángel Vaca",
            },
            characteristics: [
                "20 cabañas sobre pilotes en la selva",
                "Puentes colgantes entre dosel de árboles",
                "Miradores para avistamiento de aves",
                "Spa con tratamientos amazónicos",
                "Restaurante con productos locales",
                "Centro de interpretación ambiental",
                "Sendero educativo de 3 km",
                "Piscina natural con filtro biológico",
            ],
            challenges: [
                "Acceso limitado en época de lluvias",
                "Preservación del ecosistema intacto",
                "Abastecimiento en zona remota",
                "Protección contra fauna silvestre",
            ],
            solutions: [
                "Sistema de transporte fluvial propio",
                "Construcción sin tala de árboles adultos",
                "Huerto orgánico y sistema de captación de agua",
                "Diseño que disuade ingreso de animales a espacios habitados",
            ],
            gallery_equirectangular: ["rurre_1", "rurre_2", "rurre_3"],
            gallery_images: ["3d_lodge_1", "3d_lodge_2"],
        },
        {
            title: "Estadio Nacional de Alto Rendimiento - Sucre",
            description:
                "Complejo deportivo polifuncional diseñado para entrenamiento de alto rendimiento y competencias internacionales, ubicado en la capital constitucional de Bolivia.",
            category: "Salud",
            status: "En diseño",
            tags: {
                location: "Sucre, Chuquisaca",
                area: "32,000 m²",
                duration: "34 meses",
                estimation: "$45,000,000 USD",
                year: 2025,
                architect: "Arq. Roberto Sánchez",
            },
            characteristics: [
                "Pista atlética certificada World Athletics",
                "Campo de fútbol con sistema de drenaje avanzado",
                "Piscina olímpica semiolímpica techada",
                "Gimnasio de halterofilia y artes marciales",
                "Centro de medicina deportiva",
                "Alojamiento para 200 atletas",
                "Laboratorio de biomecánica",
                "Estadio principal para 15,000 espectadores",
            ],
            challenges: [
                "Topografía irregular de los valles de Sucre",
                "Clima variable entre día y noche",
                "Necesidad de múltiples disciplinas en un mismo espacio",
                "Integración con el entorno histórico de la ciudad",
            ],
            solutions: [
                "Terraplenes que aprovechan la pendiente natural",
                "Sistema de climatización pasiva con muros de adobe",
                "Diseño modular que permite reconfigurar espacios",
                "Materiales y colores que reflejan la arquitectura colonial",
            ],
            gallery_equirectangular: ["estadio_1"],
            gallery_images: [
                "3d_deportivo_1",
                "3d_deportivo_2",
                "3d_deportivo_3",
            ],
        },
        {
            title: "Mercado Mayorista de Alimentos - El Alto",
            description:
                "Centro de abastecimiento y distribución de alimentos más grande de Bolivia, diseñado como nodo logístico inteligente para optimizar la cadena de suministro alimentario.",
            category: "Cultural",
            status: "Completado",
            tags: {
                location: "Distrito 8, El Alto",
                area: "42,000 m²",
                duration: "26 meses",
                estimation: "$28,000,000 USD",
                year: 2021,
                architect: "Arq. Elena Mamani",
            },
            characteristics: [
                "300 puestos de venta climatizados",
                "Cámaras frigoríficas para productos perecederos",
                "Centro de clasificación y empaque automatizado",
                "Plataforma logística para 100 camiones",
                "Sistema de gestión de residuos orgánicos",
                "Centro de capacitación para comerciantes",
                "Banco y servicios financieros",
                "Sistema de energía solar fotovoltaica",
            ],
            challenges: [
                "Temperaturas bajo cero nocturnas",
                "Gestionar alta afluencia diaria (20,000 personas)",
                "Manejo de residuos orgánicos a gran escala",
                "Seguridad en zona de alta densidad poblacional",
            ],
            solutions: [
                "Cubiertas aislantes con calefacción radiante",
                "Diseño de flujos separados para peatones y vehículos",
                "Planta de biogas que genera energía de los desechos",
                "Sistema de videovigilancia y patrullaje integrado",
            ],
            gallery_equirectangular: ["mercado_1", "mercado_2"],
            gallery_images: ["3d_mercado_1", "3d_mercado_2"],
        },
        {
            title: "Centro de Innovación Tecnológica - Tarija",
            description:
                "Hub de investigación y desarrollo tecnológico especializado en energías renovables y agricultura de precisión para los valles tarijeños y la región del Chaco.",
            category: "Infraestructura",
            status: "En construcción",
            tags: {
                location: "Tarija",
                area: "16,500 m²",
                duration: "24 meses",
                estimation: "$22,000,000 USD",
                year: 2024,
                architect: "Arq. Jorge Méndez",
            },
            characteristics: [
                "Laboratorios de nanotecnología",
                "Invernaderos inteligentes para investigación",
                "Centro de datos con supercomputadora",
                "Espacios de coworking y maker space",
                "Auditorio para 500 personas",
                "Vivero de empresas tecnológicas",
                "Residencia para investigadores internacionales",
                "Planta piloto de energía geotérmica",
            ],
            challenges: [
                "Atraer talento internacional a provincia",
                "Conexión de alta velocidad para transferencia de datos",
                "Climatización de espacios con equipos sensibles",
                "Integración con sector productivo local",
            ],
            solutions: [
                "Diseño de calidad de vida premium para investigadores",
                "Enlace de fibra óptica dedicado",
                "Sistema de redundancia energética y climatización",
                "Espacios flexibles para colaboración universidad-empresa",
            ],
            gallery_equirectangular: ["innovacion_1", "innovacion_2"],
            gallery_images: ["3d_tecnologico_1", "3d_tecnologico_2"],
        },
        {
            title: "Terminal de Buses Bimodal - Potosí",
            description:
                "Estación intermodal que integra transporte terrestre y futuro sistema de teleférico, diseñada como puerta de entrada a la ciudad patrimonial de la humanidad.",
            category: "Infraestructura",
            status: "Completado",
            tags: {
                location: "Potosí",
                area: "9,800 m²",
                duration: "20 meses",
                estimation: "$15,000,000 USD",
                year: 2023,
                architect: "Arq. Luis Fernando Correa",
            },
            characteristics: [
                "30 plataformas para buses interdepartamentales",
                "Estación de teleférico integrada",
                "Centro comercial con 50 locales",
                "Hotel de tránsito para viajeros",
                "Terminal de carga y paquetería",
                "Oficinas de migración y aduana",
                "Capilla ecuménica",
                "Sistema de información digital en tiempo real",
            ],
            challenges: [
                "Integración con tejido urbano histórico",
                "Altitud extrema (4,070 msnm)",
                "Espacio limitado en ciudad rodeada de cerros",
                "Preservación de vistas al Cerro Rico",
            ],
            solutions: [
                "Diseño de volumetría escalonada que respeta perfil urbano",
                "Sistema de oxígeno enriquecido en áreas cerradas",
                "Desarrollo vertical con sótanos para estacionamiento",
                "Vidrios especiales que permiten visual al patrimonio",
            ],
            gallery_equirectangular: ["terminal_1", "terminal_2"],
            gallery_images: ["3d_terminal_1", "3d_terminal_2"],
        },
        {
            title: "Complejo Habitacional Social - Montero",
            description:
                "Conjunto de viviendas de interés social que implementa nuevos modelos de densificación sostenible para ciudades intermedias del trópico boliviano.",
            category: "Salud",
            status: "Completado",
            tags: {
                location: "Montero, Santa Cruz",
                area: "65,000 m²",
                duration: "30 meses",
                estimation: "$35,000,000 USD",
                year: 2022,
                architect: "Arq. Ana María Suárez",
            },
            characteristics: [
                "800 viviendas de 60-90 m²",
                "Centro comunitario polifuncional",
                "Escuela primaria dentro del complejo",
                "Áreas verdes con parques infantiles",
                "Mercado local de abastecimiento",
                "Sistema de agua potable y saneamiento propio",
                "Calles peatonales y ciclo vías",
                "Huertos comunitarios organizados",
            ],
            challenges: [
                "Vivienda accesible con calidad constructiva",
                "Gestión comunitaria post-entrega",
                "Infraestructura básica en zona de expansión urbana",
                "Prevención de asentamientos informales alrededor",
            ],
            solutions: [
                "Sistema constructivo industrializado que reduce costos",
                "Modelo de autogestión comunitaria capacitada",
                "Planta de tratamiento de agua y energía solar compartida",
                "Diseño de bordes activos que integran con contexto",
            ],
            gallery_equirectangular: ["montero_1", "montero_2", "montero_3"],
            gallery_images: ["3d_social_1", "3d_social_2"],
        },
        {
            title: "Centro de Convenciones Internacional - Santa Cruz",
            description:
                "Recinto ferial y de convenciones de clase mundial diseñado para posicionar a Santa Cruz como hub de negocios de Sudamérica, inspirado en la biodiversidad amazónica.",
            category: "Cultural",
            status: "En diseño",
            tags: {
                location: "Santa Cruz de la Sierra",
                area: "85,000 m²",
                duration: "42 meses",
                estimation: "$120,000,000 USD",
                year: 2026,
                architect: "Arq. Ricardo Paz",
            },
            characteristics: [
                "Sala principal para 10,000 personas",
                "12 salas modulares de diferentes capacidades",
                "Pabellón de exposiciones de 20,000 m²",
                "Centro de prensa internacional",
                "Hotel de 500 habitaciones conectado",
                "Restaurantes y área comercial",
                "Helipuerto y estacionamiento para 3,000 vehículos",
                "Parque temático de la biodiversidad boliviana",
            ],
            challenges: [
                "Competir con centros de convenciones de la región",
                "Flexibilidad para eventos de diferentes escalas",
                "Sostenibilidad en edificio de gran consumo energético",
                "Conectividad internacional directa",
            ],
            solutions: [
                "Diseño icónico que se convierte en símbolo de la ciudad",
                "Sistema de particiones móviles y tecnología adaptable",
                "Certificación LEED Platinum con sistema de captación pluvial",
                "Conectividad con aeropuerto internacional a 15 minutos",
            ],
            gallery_equirectangular: ["convenciones_1"],
            gallery_images: [
                "3d_convenciones_1",
                "3d_convenciones_2",
                "3d_convenciones_3",
            ],
        },
        {
            title: "Planta de Tratamiento de Aguas - Cochabamba",
            description:
                "Sistema integral de tratamiento y reutilización de aguas residuales que resuelve el déficit hídrico crónico de la región metropolitana de Cochabamba.",
            category: "Infraestructura",
            status: "En construcción",
            tags: {
                location: "Cercado, Cochabamba",
                area: "28,000 m²",
                duration: "32 meses",
                estimation: "$85,000,000 USD",
                year: 2024,
                architect: "Arq. Diego Andrade",
            },
            characteristics: [
                "Capacidad: 200,000 m³/día",
                "Sistema terciario para agua de riego",
                "Planta de generación de biogas",
                "Centro educativo sobre ciclo del agua",
                "Laboratorio de monitoreo ambiental",
                "Parque público con lagunas de oxidación",
                "Sistema de bombeo de agua tratada a represas",
                "Estación de medición de calidad continua",
            ],
            challenges: [
                "Tratar aguas con alta carga industrial",
                "Socializar proyecto tras conflictos históricos por el agua",
                "Integración paisajística en zona periurbana",
                "Operación con bajos costos de mantenimiento",
            ],
            solutions: [
                "Sistema de pretratamiento para efluentes industriales",
                "Diseño transparente con visitas guiadas para la comunidad",
                "Parque ambiental que recupera espacio público",
                "Automatización avanzada y energía autogenerada",
            ],
            gallery_equirectangular: ["aguas_1", "aguas_2"],
            gallery_images: ["3d_planta_agua_1", "3d_planta_agua_2"],
        },
        {
            title: "Torre Mirador Cerro Rico - Potosí",
            description:
                "Estructura de observación y centro interpretativo que permite una experiencia única del Cerro Rico, combinando turismo responsable con preservación del patrimonio minero.",
            category: "Salud",
            status: "Completado",
            tags: {
                location: "Base del Cerro Rico, Potosí",
                area: "2,500 m²",
                duration: "16 meses",
                estimation: "$6,500,000 USD",
                year: 2021,
                architect: "Arq. Valeria Salinas",
            },
            characteristics: [
                "Mirador a 50 metros de altura",
                "Museo de la minería colonial",
                "Centro de documentación histórica",
                "Cafetería con vista panorámica",
                "Tienda de artesanías en plata",
                "Sala de realidad virtual de las minas",
                "Espacio para rituales mineros tradicionales",
                "Sendero ecológico con estaciones interpretativas",
            ],
            challenges: [
                "Intervenir en sitio patrimonio mundial UNESCO",
                "Condiciones extremas de viento y temperatura",
                "Suelos inestables por actividad minera histórica",
                "Respeto a significados culturales y religiosos",
            ],
            solutions: [
                "Estructura desmontable sin cimentación profunda",
                "Forma aerodinámica que disipa vientos",
                "Sistema de micropilotes que no afecta galerías",
                "Diseño consensuado con comunidades mineras",
            ],
            gallery_equirectangular: ["mirador_1", "mirador_2", "mirador_3"],
            gallery_images: ["3d_mirador_1", "3d_mirador_2"],
        },
        {
            title: "Edificio Judicial Departamental - Trinidad",
            description:
                "Sede de la justicia para el departamento del Beni, que reinterpreta la arquitectura moxeña con espacios diseñados para procesos judiciales modernos y humanizados.",
            category: "Institucional",
            status: "En construcción",
            tags: {
                location: "Trinidad, Beni",
                area: "14,000 m²",
                duration: "26 meses",
                estimation: "$28,000,000 USD",
                year: 2024,
                architect: "Arq. Rafael Vargas",
            },
            characteristics: [
                "25 salas de audiencia",
                "Centro de mediación y justicia restaurativa",
                "Archivo judicial con sistema robotizado",
                "Sala de vistas virtuales para zonas remotas",
                "Espacios para víctimas con atención psicológica",
                "Biblioteca jurídica especializada",
                "Área para prensa y transparencia",
                "Patios inspirados en plazas moxeñas",
            ],
            challenges: [
                "Clima tropical lluvioso con alta humedad",
                "Inundaciones estacionales de la región",
                "Seguridad para procesos de alta sensibilidad",
                "Accesibilidad para comunidades indígenas",
            ],
            solutions: [
                "Diseño elevado sobre pilotis de 3 metros",
                "Sistema de drenaje y retención pluvial",
                "Control de accesos con tecnología biométrica",
                "Intérpretes y señalética en lenguas originarias",
            ],
            gallery_equirectangular: ["judicial_1", "judicial_2"],
            gallery_images: ["3d_judicial_1", "3d_judicial_2", "3d_judicial_3"],
        },
    ];

    const categories = [
        "Todos",
        "Cultural",
        "Salud",
        "Institucional",
        "Infraestructura",
    ];

    const [category, setCategory] = useState("Todos");

    const gridRef = useRef(null);
    const shuffleRef = useRef(null);

    // const filteredProjects =
    //     category === "Todos"
    //         ? projectsDB
    //         : projectsDB.filter((project) => {
    //               return project.category === category;
    //           });

    const handleFilter = (cat) => {
        setCategory(cat);

        if (shuffleRef.current) {
            // oxlint-disable-next-line no-unused-expressions
            cat === "Todos"
                ? shuffleRef.current.filter(Shuffle.ALL_ITEMS)
                : shuffleRef.current.filter(cat);
        }
    };

    useEffect(() => {
        if (gridRef.current) {
            shuffleRef.current = new Shuffle(gridRef.current, {
                itemSelector: ".project-card",
                sizer: ".shuffle-sizer",
                speed: 300,
                useCSSGrid: false,
                columnWidth: 0,
            });
            console.log("✅ Shuffle.js inicializado");
        }

        return () => {
            if (shuffleRef.current) {
                shuffleRef.current.destroy();
                console.log("🗑️ Shuffle.js destruido");
            }
        };
    }, []);

    return (
        <AuthenticatedLayout>
            <div className="py-6">
                <div className="actions mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="px-2 sm:px-0">
                        <section className="flex flex-col gap-4 relative">
                            <header>
                                <h1 className="text-center text-step-6 font-bold text-primary-500">
                                    Nuestros proyectos
                                </h1>
                                <p className="text-center text-step-2 max-w-xl mx-auto">
                                    Explora nuestra amplia cartera de proyectos
                                    arquitectónicos que abarcan desde
                                    residencias de lujo hasta complejos
                                    comerciales e institucionales.
                                </p>
                            </header>
                            <div className="filters flex flex-col gap-4">
                                <h2 className="text-step-3 font-bold text-primary-500">
                                    Filtrar por categoría
                                </h2>
                                <div className="filter-buttons flex flex-row gap-3 flex-wrap">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={(event) => {
                                                // setCategory(cat);
                                                handleFilter(cat);
                                            }}
                                            className={`category border border-primary-100 shadow-md px-3 py-1 rounded-md text-step-2 font-medium hover:text-white hover:bg-primary-400 hover:border-primary-300 transition-colors duration-200
                                            ${
                                                category.toLowerCase() ===
                                                cat.toLowerCase()
                                                    ? "bg-primary-500 text-white"
                                                    : ""
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>
                        <section
                            ref={gridRef}
                            className="projects projects-container my-8 overflow-hidden relative"
                        >
                            <div className="shuffle-sizer w-[1px] h-0 invisible absolute"></div>

                            {projectsDB.map((project) => (
                                <a
                                    href=""
                                    data-groups={`["${project.category}"]`}
                                    key={project.title}
                                    className="project-card float-left w-full max-w-[600px] md:max-w-[320px] xl:max-w-[380px] md:h-[540px] mr-6 mb-6 
                                    border border-gray-200 rounded-md relative bg-white 
                                    group 
                                    before:absolute before:inset-0 before:shadow-transparent before:transition-all before:duration-300
                                     before:-z-10 before:shadow-md hover:before:shadow-gray-400"
                                >
                                    <article className="flex flex-col gap-4 relative bg-white">
                                        <div className="tags absolute top-2 left-2 flex flex-row gap-2 text-step-1 z-20">
                                            <span className="bg-secondary-500 text-white px-2 rounded-md">
                                                {project.category}
                                            </span>
                                            <span className="bg-primary-200 text-black px-2 rounded-md">
                                                {project.status}
                                            </span>
                                        </div>
                                        <picture className="overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop"
                                                alt="Random build"
                                                className="w-full h-auto object-cover max-h-64 aspect-square transition-transform duration-300
                                                group-hover:scale-110 group-hover:-z-10"
                                            />
                                        </picture>
                                        <header className="px-4 pt-2">
                                            <h3
                                                className="text-step-3 font-bold text-primary-500 leading-none
                                                transition-colors duration-300
                                            group-hover:text-secondary-500"
                                            >
                                                {project.title}
                                            </h3>
                                        </header>
                                        <div className="content grow flex">
                                            <p className="px-4 text-balance text-gray-700 text-step-2 font-extralight leading-5 line-clamp-5 self-center">
                                                {project.description}
                                            </p>
                                        </div>
                                        <footer className="px-4 pb-6">
                                            <ul className="[&>li]:text-gray-700 text-step-1">
                                                <li className="flex flex-row gap-1 items-center">
                                                    <IconLocation size="16" />
                                                    {project.tags.location}
                                                </li>
                                                <li className="flex flex-row gap-1 items-center">
                                                    <IconCalendar size="16" />
                                                    Septiembre
                                                </li>
                                                <li className="flex flex-row gap-1 items-center">
                                                    <IconClock size="16" />
                                                    12 meses
                                                </li>
                                            </ul>
                                        </footer>
                                    </article>
                                </a>
                            ))}
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
