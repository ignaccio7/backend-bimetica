// resources/js/Pages/Resource/Gallery/List.jsx
import ModalConfirm from "@/Components/ui/ModalConfirm";
import { IconPencil, IconTrash } from "@/Icons/icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

function GalleryRow({ gallery, onDelete }) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto auto",
                gap: "0.75rem",
                alignItems: "center",
                padding: "0.875rem 1rem",
                borderBottom: "1px solid #f1f5f9",
                backgroundColor: "#fff",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                }}
            >
                <span
                    style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1e293b",
                    }}
                >
                    {gallery.title || (
                        <span style={{ color: "#cbd5e1", fontStyle: "italic" }}>
                            Sin título
                        </span>
                    )}
                </span>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                    Orden: {gallery.order} · {gallery.image_count}{" "}
                    {gallery.image_count === 1 ? "imagen" : "imágenes"}
                </span>
            </div>

            {/* Miniaturas preview */}
            <div style={{ display: "flex", gap: "0.25rem" }}>
                {gallery.image_urls?.slice(0, 4).map((url, i) => (
                    <img
                        key={i}
                        src={url}
                        alt={`img-${i}`}
                        style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            objectFit: "cover",
                            borderRadius: "0.25rem",
                            border: "1px solid #e2e8f0",
                        }}
                    />
                ))}
                {gallery.image_count > 4 && (
                    <div
                        style={{
                            width: "2.5rem",
                            height: "2.5rem",
                            borderRadius: "0.25rem",
                            backgroundColor: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.7rem",
                            color: "#94a3b8",
                            fontWeight: "700",
                        }}
                    >
                        +{gallery.image_count - 4}
                    </div>
                )}
            </div>

            <Link
                href={route("resource-gallery.edit", {
                    resourceGallery: gallery.id,
                })}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.35rem 0.625rem",
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    textDecoration: "none",
                }}
            >
                <IconPencil />
            </Link>

            <button
                onClick={() => onDelete(gallery)}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.35rem 0.625rem",
                    backgroundColor: "#dc2626",
                    color: "#fff",
                    borderRadius: "0.375rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                }}
            >
                <IconTrash />
            </button>
        </div>
    );
}

function ServiceAccordion({ service, onDelete }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            style={{
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
        >
            <button
                onClick={() => setOpen((v) => !v)}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1rem 1.25rem",
                    backgroundColor: open ? "#f8fafc" : "#fff",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    borderBottom: open ? "1px solid #e2e8f0" : "none",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                    }}
                >
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "1.5rem",
                            height: "1.5rem",
                            borderRadius: "50%",
                            backgroundColor: open ? "#4f46e5" : "#e2e8f0",
                            color: open ? "#fff" : "#94a3b8",
                            fontSize: "0.75rem",
                            fontWeight: "700",
                        }}
                    >
                        {open ? "▲" : "▼"}
                    </span>
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "1rem",
                                fontWeight: "700",
                                color: "#0f172a",
                            }}
                        >
                            {service.title}
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "0.75rem",
                                color: "#94a3b8",
                                marginTop: "0.1rem",
                            }}
                        >
                            {service.galleries.length}{" "}
                            {service.galleries.length === 1
                                ? "galería"
                                : "galerías"}
                        </p>
                    </div>
                </div>
            </button>

            <div
                style={{
                    maxHeight: open ? "2000px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto auto auto",
                        gap: "0.75rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                    }}
                >
                    {["Título / Orden", "Vista previa", "", ""].map(
                        (col, i) => (
                            <span
                                key={i}
                                style={{
                                    fontSize: "0.7rem",
                                    fontWeight: "700",
                                    color: "#94a3b8",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                }}
                            >
                                {col}
                            </span>
                        ),
                    )}
                </div>
                {service.galleries.map((gallery) => (
                    <GalleryRow
                        key={gallery.id}
                        gallery={gallery}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}

export default function List({ services }) {
    const [modal, setModal] = useState(false);
    const [selected, setSelected] = useState(null);

    const confirmDelete = () => {
        if (!selected) return;
        router.delete(
            route("resource-gallery.destroy", { resourceGallery: selected.id }),
            { onSuccess: () => setModal(false) },
        );
    };

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Galerías 360° - Bimetica" />
                <div className="py-6">
                    <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "0 0.5rem",
                            }}
                        >
                            <div>
                                <h1
                                    style={{
                                        margin: 0,
                                        fontSize: "1.25rem",
                                        fontWeight: "700",
                                        color: "#0f172a",
                                    }}
                                >
                                    Gestionar galerías 360°
                                </h1>
                                <p
                                    style={{
                                        margin: "0.25rem 0 0",
                                        fontSize: "0.875rem",
                                        color: "#64748b",
                                    }}
                                >
                                    Administra las galerías agrupadas por
                                    servicio
                                </p>
                            </div>
                            <Link
                                href={route("resource-gallery.create")}
                                className={`inline-flex items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900`}
                            >
                                + Nueva galería
                            </Link>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.75rem",
                                padding: "0 0.5rem",
                            }}
                        >
                            {services.length === 0 ? (
                                <div
                                    style={{
                                        padding: "3rem",
                                        textAlign: "center",
                                        color: "#94a3b8",
                                        backgroundColor: "#f8fafc",
                                        borderRadius: "0.75rem",
                                        border: "1px dashed #e2e8f0",
                                    }}
                                >
                                    No hay galerías registradas aún.
                                </div>
                            ) : (
                                services.map((service) => (
                                    <ServiceAccordion
                                        key={service.id}
                                        service={service}
                                        onDelete={(g) => {
                                            setSelected(g);
                                            setModal(true);
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
            <ModalConfirm
                isOpen={modal}
                closeModal={() => setModal(false)}
                onConfirm={confirmDelete}
                title="¿Eliminar galería?"
                message="Se eliminarán todas las imágenes. Esta acción no se puede deshacer."
            />
        </>
    );
}
