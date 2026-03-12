// resources/js/Pages/Resource/Resources.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect, Fragment } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import PdfToImages from "@/Components/ui/PdfToImages";
import Magazine from "@/Pages/Project/components/Magazine";

const COLORS = [
    { color: "#9AC72D", hover: "#7E9B1F" },
    { color: "#3E55B4", hover: "#2E4090" },
    { color: "#1D2753", hover: "#141C3A" },
    { color: "#C7522A", hover: "#A33E1A" },
    { color: "#2A7A6F", hover: "#1A5A51" },
];

function ResourceCard({ resource }) {
    const [images, setImages] = useState([]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                backgroundColor: "#f8fafc",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                padding: "1rem",
            }}
        >
            {/* Título */}
            {resource.title && (
                <h3
                    style={{
                        fontSize: "0.95rem",
                        fontWeight: "700",
                        color: "#1e293b",
                        margin: 0,
                    }}
                >
                    {resource.title}
                </h3>
            )}

            {/* Categorías */}
            {resource.categories?.length > 0 && (
                <ul
                    style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.2rem",
                    }}
                >
                    {resource.categories.map((cat) => (
                        <li
                            key={cat}
                            style={{
                                fontSize: "0.75rem",
                                color: "#475569",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "0.3rem",
                            }}
                        >
                            <span
                                style={{
                                    color: "#9AC72D",
                                    fontWeight: "700",
                                    flexShrink: 0,
                                }}
                            >
                                •
                            </span>
                            {cat}
                        </li>
                    ))}
                </ul>
            )}

            {/* PDF → Magazine — igual que en Show.jsx */}
            {resource.pdf_url && (
                <div style={{ overflow: "hidden" }}>
                    <PdfToImages
                        pdfUrl={resource.pdf_url}
                        onLoad={(imgs) => setImages(imgs)}
                    />
                    {images.length > 0 && (
                        <Magazine
                            images={images}
                            orientation={resource.orientation ?? "vertical"}
                        />
                    )}
                </div>
            )}

            {!resource.pdf_url && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "60px",
                        fontSize: "0.75rem",
                        color: "#cbd5e1",
                        fontStyle: "italic",
                    }}
                >
                    Sin PDF adjunto
                </div>
            )}
        </div>
    );
}

// ─── Modal del servicio ───────────────────────────────────────────────────────
function ServiceModal({ service, isOpen, onClose }) {
    if (!service) return null;

    console.log(service);

    const resources = service.resources ?? [];

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                style={{ position: "relative", zIndex: 50 }}
                onClose={onClose}
            >
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(0,0,0,0.6)",
                        }}
                    />
                </TransitionChild>

                <div style={{ position: "fixed", inset: 0, overflowY: "auto" }}>
                    <div
                        style={{
                            display: "flex",
                            minHeight: "100%",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            padding: "1.5rem 1rem",
                        }}
                    >
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel
                                style={{
                                    width: "100%",
                                    maxWidth: "72rem",
                                    backgroundColor: "#fff",
                                    borderRadius: "1rem",
                                    padding: "1.75rem",
                                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                                }}
                            >
                                {/* Header */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: "1.5rem",
                                        borderBottom: "1px solid #f1f5f9",
                                        paddingBottom: "1rem",
                                    }}
                                >
                                    <DialogTitle
                                        style={{
                                            fontSize: "1.25rem",
                                            fontWeight: "700",
                                            color: "#0f172a",
                                            margin: 0,
                                        }}
                                    >
                                        {service.title}
                                    </DialogTitle>
                                    <span
                                        style={{
                                            fontSize: "0.75rem",
                                            color: "#94a3b8",
                                            backgroundColor: "#f1f5f9",
                                            padding: "0.25rem 0.625rem",
                                            borderRadius: "9999px",
                                        }}
                                    >
                                        {resources.length}{" "}
                                        {resources.length === 1
                                            ? "recurso"
                                            : "recursos"}
                                    </span>
                                </div>

                                {/* Grid 2 columnas — último impar ocupa las 2 */}
                                <style>{`
                                    .resource-grid {
                                        display: grid;
                                        grid-template-columns: repeat(2, 1fr);
                                        gap: 1.25rem;
                                    }
                                    .resource-last-odd {
                                        grid-column: 1 / -1;
                                        max-width: 50%;
                                        margin: 0 auto;
                                        width: 100%;
                                    }
                                    @media (max-width: 640px) {
                                        .resource-grid { grid-template-columns: 1fr !important; }
                                        .resource-last-odd { grid-column: 1 !important; max-width: 100% !important; }
                                    }
                                `}</style>

                                <div className="resource-grid">
                                    {resources.map((resource, i) => {
                                        const isLastOdd =
                                            resources.length % 2 !== 0 &&
                                            i === resources.length - 1;
                                        return (
                                            <div
                                                key={resource.id}
                                                className={
                                                    isLastOdd
                                                        ? "resource-last-odd"
                                                        : ""
                                                }
                                            >
                                                <ResourceCard
                                                    resource={resource}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Cerrar */}
                                <div
                                    style={{
                                        marginTop: "1.5rem",
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <button
                                        onClick={onClose}
                                        style={{
                                            padding: "0.5rem 1.25rem",
                                            backgroundColor: "#4b5563",
                                            color: "#fff",
                                            borderRadius: "0.375rem",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Resources({ auth, services }) {
    const [serviceModal, setServiceModal] = useState({
        open: false,
        service: null,
    });

    return (
        <AuthenticatedLayout user={auth.user}>
            <div style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
                <div
                    style={{
                        maxWidth: "80rem",
                        margin: "0 auto",
                        padding: "0 1.5rem",
                    }}
                >
                    <header
                        style={{ textAlign: "center", marginBottom: "2rem" }}
                    >
                        <h1
                            style={{
                                fontSize: "2rem",
                                fontWeight: "bold",
                                color: "#9AC72D",
                            }}
                        >
                            Nuestros recursos
                        </h1>
                        <p
                            style={{
                                maxWidth: "36rem",
                                margin: "0.5rem auto 0",
                                color: "#6b7280",
                            }}
                        >
                            Base de datos de recursos por servicio.
                        </p>
                    </header>

                    <section
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "1.25rem",
                            padding: "1rem 0 2.5rem",
                        }}
                    >
                        {services.map((service, i) => {
                            const palette = COLORS[i % COLORS.length];
                            return (
                                <button
                                    key={service.id}
                                    onClick={() =>
                                        setServiceModal({ open: true, service })
                                    }
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            palette.hover)
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                            palette.color)
                                    }
                                    style={{
                                        backgroundColor: palette.color,
                                        color: "#fff",
                                        padding: "0.5rem 1.5rem",
                                        border: "none",
                                        borderRadius: "0.375rem",
                                        textTransform: "uppercase",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                        fontSize: "0.875rem",
                                        fontWeight: "600",
                                        minWidth: "260px",
                                    }}
                                >
                                    {service.title}
                                </button>
                            );
                        })}
                    </section>
                </div>
            </div>

            <ServiceModal
                service={serviceModal.service}
                isOpen={serviceModal.open}
                onClose={() => setServiceModal({ open: false, service: null })}
            />
        </AuthenticatedLayout>
    );
}
