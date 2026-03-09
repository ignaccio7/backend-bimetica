import {
    IconCalendar,
    IconClock,
    IconLocation,
    IconUser,
    IconRuler,
    IconTag,
} from "@/Icons/icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import Shuffle from "shufflejs";

/* ===============================
   MAPA DE ÍCONOS POR CLAVE
   Agregar aquí más variantes según lo que uses en BD
=============================== */
const CHAR_ICON_MAP = [
    {
        keys: [
            "ubicación",
            "ubicacion",
            "location",
            "lugar",
            "ciudad",
            "dirección",
            "direccion",
        ],
        icon: <IconLocation size="16" />,
    },
    {
        keys: ["año", "anio", "year", "fecha", "date"],
        icon: <IconCalendar size="16" />,
    },
    {
        keys: ["duración", "duracion", "duration", "tiempo", "plazo", "meses"],
        icon: <IconClock size="16" />,
    },
    {
        keys: ["arquitecto", "architect", "diseñador", "responsable"],
        icon: <IconUser size="16" />,
    },
    {
        keys: ["área", "area", "superficie", "m2", "metros", "tamaño"],
        icon: <IconRuler size="16" />,
    },
];

function getCharIcon(key) {
    const normalized = key.toLowerCase().trim();
    const match = CHAR_ICON_MAP.find((entry) =>
        entry.keys.some((k) => normalized.includes(k)),
    );
    // Ícono genérico si no coincide con ninguna clave conocida
    return match ? match.icon : <IconTag size="16" />;
}

export default function ProjectsList({ auth, projects = [] }) {
    const categories = [
        "Todos",
        ...new Set(projects.map((p) => p.category).filter(Boolean)),
    ];

    const [category, setCategory] = useState("Todos");

    const gridRef = useRef(null);
    const shuffleRef = useRef(null);

    const handleFilter = (cat) => {
        setCategory(cat);

        if (shuffleRef.current) {
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
        }

        return () => {
            if (shuffleRef.current) {
                shuffleRef.current.destroy();
            }
        };
    }, []);

    return (
        <AuthenticatedLayout user={auth?.user}>
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
                                            onClick={() => handleFilter(cat)}
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

                            {projects.length === 0 ? (
                                <p className="text-center text-gray-400 py-16">
                                    No hay proyectos disponibles.
                                </p>
                            ) : (
                                projects.map((project) => {
                                    // Tomar solo las primeras 3 características
                                    const charEntries = Object.entries(
                                        project.characteristics ?? {},
                                    ).slice(0, 3);

                                    return (
                                        <Link
                                            href={route("project.show", {
                                                project: project.slug,
                                            })}
                                            data-groups={`["${project.category ?? "Sin categoría"}"]`}
                                            key={project.slug}
                                            className="project-card w-full max-w-[600px] md:max-w-[320px] xl:max-w-[380px] md:min-h-[500px] md:h-auto mr-6 mb-6
                                            border border-gray-200 rounded-md relative bg-white
                                            group
                                            before:absolute before:inset-0 before:shadow-transparent before:transition-all before:duration-300
                                            before:-z-10 before:shadow-md hover:before:shadow-gray-400"
                                        >
                                            <article className="flex flex-col gap-4 relative bg-white h-full md:min-h-[500px] md:h-auto">
                                                {/* BADGES */}
                                                <div className="tags absolute top-2 left-2 flex flex-row gap-2 text-step-1 z-20">
                                                    {project.category && (
                                                        <span className="bg-secondary-500 text-white px-2 rounded-md">
                                                            {project.category}
                                                        </span>
                                                    )}
                                                    {project.status && (
                                                        <span className="bg-primary-200 text-black px-2 rounded-md">
                                                            {project.status}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* IMAGEN */}
                                                <picture className="overflow-hidden">
                                                    <img
                                                        src={
                                                            project.cover_url ??
                                                            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop"
                                                        }
                                                        alt={project.title}
                                                        className="w-full h-auto object-cover max-h-64 aspect-square transition-transform duration-300
                                                        group-hover:scale-110 group-hover:-z-10"
                                                    />
                                                </picture>

                                                {/* TÍTULO */}
                                                <header className="px-4 pt-2">
                                                    <h3
                                                        className="text-step-3 font-bold text-primary-500 leading-none
                                                        transition-colors duration-300
                                                        group-hover:text-secondary-500"
                                                    >
                                                        {project.title}
                                                    </h3>
                                                </header>

                                                {/* DESCRIPCIÓN — máx 4 líneas con ellipsis */}
                                                <div className="content grow flex">
                                                    <p className="px-4 text-balance text-gray-700 text-step-2 font-extralight leading-5 line-clamp-4 self-start">
                                                        {project.description ??
                                                            "Sin descripción."}
                                                    </p>
                                                </div>

                                                {/* CARACTERÍSTICAS — máx 3, ícono según clave */}
                                                <footer className="px-4 pb-6">
                                                    {charEntries.length > 0 ? (
                                                        <ul className="[&>li]:text-gray-700 text-step-2 grid grid-cols-2 gap-2">
                                                            {charEntries.map(
                                                                ([
                                                                    key,
                                                                    value,
                                                                ]) => (
                                                                    <li
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="flex flex-row gap-1 items-center"
                                                                    >
                                                                        {getCharIcon(
                                                                            key,
                                                                        )}
                                                                        <span className="truncate">
                                                                            {
                                                                                key
                                                                            }
                                                                            :{" "}
                                                                            {
                                                                                value
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        // Sin características: mostrar fecha de creación
                                                        <ul className="[&>li]:text-gray-700 text-step-2">
                                                            <li className="flex flex-row gap-1 items-center">
                                                                <IconCalendar size="16" />
                                                                {new Date(
                                                                    project.created_at,
                                                                ).toLocaleDateString(
                                                                    "es-ES",
                                                                    {
                                                                        month: "long",
                                                                        year: "numeric",
                                                                    },
                                                                )}
                                                            </li>
                                                        </ul>
                                                    )}
                                                </footer>
                                            </article>
                                        </Link>
                                    );
                                })
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
