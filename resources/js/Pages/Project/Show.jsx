import {
    IconCalendar,
    IconClock,
    IconLocation,
    IconUser,
    IconRuler,
    IconTag,
} from "@/Icons/icons";
import Magazine from "./components/Magazine";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PdfToImages from "@/Components/ui/PdfToImages";
import { useState } from "react";
import { Head } from "@inertiajs/react";

/* ================================================
   MAPA DE ÍCONOS — normaliza tildes para comparar
================================================ */
const CHAR_ICON_MAP = [
    {
        keys: ["ubicacion", "location", "lugar", "ciudad", "direccion"],
        icon: <IconLocation size="16" />,
    },
    {
        keys: ["ano", "year", "fecha", "date"],
        icon: <IconCalendar size="16" />,
    },
    {
        keys: ["duracion", "duration", "tiempo", "plazo", "meses"],
        icon: <IconClock size="16" />,
    },
    {
        keys: ["arquitecto", "architect", "disenador", "responsable"],
        icon: <IconUser size="16" />,
    },
    {
        keys: ["area", "superficie", "m2", "metros", "tamano"],
        icon: <IconRuler size="16" />,
    },
];

function getCharIcon(key) {
    const normalized = key
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    const match = CHAR_ICON_MAP.find((entry) =>
        entry.keys.some((k) => normalized.includes(k)),
    );
    return match ? match.icon : <IconTag size="16" />;
}

export default function Show({ auth, project }) {
    // console.log(project);

    const [pdfImages, setPdfImages] = useState([]);

    if (!project) {
        return (
            <AuthenticatedLayout user={auth?.user}>
                <div className="py-20 text-center text-gray-400">
                    Proyecto no encontrado.
                </div>
            </AuthenticatedLayout>
        );
    }

    const charEntries = Object.entries(project.characteristics ?? {});
    const pdfUrl = project.pdf_url ?? null;

    return (
        <AuthenticatedLayout user={auth?.user}>
            <Head title="Proyecto" />
            <div className="py-6">
                <div className="actions mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="px-2 sm:px-0">
                        {/* ══ HERO ══ */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
                            <article className="flex flex-col gap-4 md:gap-6">
                                {/* Badges */}
                                <div className="tags flex flex-row gap-2 text-step-2 z-20">
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

                                {/* Título */}
                                <header>
                                    <h1 className="text-start text-step-6 font-black text-primary-500 leading-none text-balance">
                                        {project.title}
                                    </h1>
                                </header>

                                {/* Descripción */}
                                {project.description && (
                                    <p className="text-step-2 break-words">
                                        {project.description}
                                    </p>
                                )}

                                {/* Características — todas, sin límite */}
                                {charEntries.length > 0 && (
                                    <footer>
                                        <ul className="[&>li]:text-gray-700 text-step-2 grid grid-cols-2 gap-2">
                                            {charEntries.map(([key, value]) => (
                                                <li
                                                    key={key}
                                                    className="flex flex-row gap-1 items-center"
                                                >
                                                    {getCharIcon(key)}
                                                    <span>
                                                        {key}: {value}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </footer>
                                )}
                            </article>

                            {/* Imagen portada */}
                            <picture className="place-self-center">
                                <img
                                    className="rounded-md w-full object-cover"
                                    src={
                                        project.cover_url ??
                                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop"
                                    }
                                    alt={project.title}
                                />
                            </picture>
                        </section>

                        {/* ══ GALERÍA 360° ══ */}
                        {project.kuula_id && (
                            <section className="gallery-equirectangular mt-20 mb-10">
                                <h2 className="text-center text-step-4 font-black text-primary-500 leading-none text-balance mb-6">
                                    Galería del proyecto
                                </h2>
                                <div className="rounded-xl overflow-hidden border border-gray-200">
                                    <iframe
                                        width="100%"
                                        height="640"
                                        frameBorder="0"
                                        allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
                                        allowFullScreen
                                        scrolling="no"
                                        src={`https://kuula.co/share/collection/${project.kuula_id}?logo=0&info=0&fs=1&vr=0&sd=1&thumbs=1`}
                                        style={{ display: "block" }}
                                    />
                                </div>
                            </section>
                        )}

                        {/* ══ REVISTA / PDF ══ */}
                        {pdfUrl && (
                            <section className="magazine mt-20 mb-50">
                                <h2 className="text-center text-step-4 font-black text-primary-500 leading-none text-balance mb-6">
                                    Conozca mas acerca de nuestro proyecto
                                </h2>
                                <div className="overflow-hidden">
                                    {/* 1. PdfToImages convierte el PDF y llama onLoad con el array */}
                                    <PdfToImages
                                        pdfUrl={pdfUrl}
                                        onLoad={(imgs) => setPdfImages(imgs)}
                                    />

                                    {/* 2. Magazine recibe el array de imágenes, igual que el modal */}
                                    {pdfImages.length > 0 && (
                                        <Magazine
                                            images={pdfImages}
                                            orientation={project.orientation}
                                        />
                                    )}
                                </div>
                            </section>
                        )}

                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
