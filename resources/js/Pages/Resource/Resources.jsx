// resources/js/Pages/Resource/Resources.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, Fragment } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import PdfToImages from "@/Components/ui/PdfToImages";
import Magazine from "@/Pages/Project/components/Magazine";
import Gallery360 from "@/Pages/Project/components/Gallery";

const COLORS = [
    { color: "#9AC72D", hover: "#7E9B1F" },
    { color: "#3E55B4", hover: "#2E4090" },
    { color: "#1D2753", hover: "#141C3A" },
    { color: "#C7522A", hover: "#A33E1A" },
    { color: "#2A7A6F", hover: "#1A5A51" },
];

function getColor(index) {
    if (index < COLORS.length) return COLORS[index];
    // Distribuye el tono uniformemente en el círculo cromático
    const hue = (index * 137) % 360; // 137° es el ángulo áureo, evita repeticiones
    const color = `hsl(${hue}, 55%, 38%)`;
    const hover = `hsl(${hue}, 55%, 28%)`;
    return { color, hover };
}

// ─── Tarjeta PDF ──────────────────────────────────────────────────────────────
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
                height: "100%",
            }}
        >
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

            {resource.pdf_url ? (
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
            ) : (
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

// ─── Tarjeta Galería 360° ─────────────────────────────────────────────────────
function GalleryCard({ gallery }) {
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
                // ✅ Contiene el desbordamiento
                overflow: "hidden",
                width: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {gallery.title && (
                    <h3
                        style={{
                            fontSize: "0.95rem",
                            fontWeight: "700",
                            color: "#1e293b",
                            margin: 0,
                        }}
                    >
                        {gallery.title}
                    </h3>
                )}
                <span
                    style={{
                        fontSize: "0.65rem",
                        fontWeight: "700",
                        color: "#fff",
                        backgroundColor: "#9AC72D",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "9999px",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        flexShrink: 0,
                        marginLeft: "0.5rem",
                    }}
                >
                    360°
                </span>
            </div>

            {gallery.images?.length > 0 ? (
                // ✅ Wrapper que fuerza ancho relativo al modal
                <div
                    style={{
                        width: "100%",
                        overflow: "hidden",
                        // Reduce la altura del swiper principal dentro del modal
                        "--gallery-height": "350px",
                    }}
                >
                    <Gallery360 images={gallery.images} mainHeight={350} />
                </div>
            ) : (
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
                    Sin imágenes
                </div>
            )}
        </div>
    );
}

// ─── Sección con título separador ─────────────────────────────────────────────
function SectionDivider({ label, count }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                margin: "0.5rem 0",
            }}
        >
            <span
                style={{
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                }}
            >
                {label}
            </span>
            <span
                style={{
                    fontSize: "0.65rem",
                    backgroundColor: "#f1f5f9",
                    color: "#94a3b8",
                    padding: "0.1rem 0.5rem",
                    borderRadius: "9999px",
                    fontWeight: "600",
                }}
            >
                {count}
            </span>
            <div
                style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }}
            />
        </div>
    );
}

// ─── Modal del servicio ───────────────────────────────────────────────────────
function ServiceModal({ service, isOpen, onClose }) {
    if (!service) return null;

    const resources = service.resources ?? [];
    const galleries = service.galleries ?? [];
    const hasResources = resources.length > 0;
    const hasGalleries = galleries.length > 0;

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
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        {hasResources && (
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "#6366f1",
                                                    backgroundColor: "#eef2ff",
                                                    padding: "0.25rem 0.625rem",
                                                    borderRadius: "9999px",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {resources.length} PDF
                                                {resources.length !== 1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        )}
                                        {hasGalleries && (
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "#16a34a",
                                                    backgroundColor: "#f0fdf4",
                                                    padding: "0.25rem 0.625rem",
                                                    borderRadius: "9999px",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                {galleries.length} galería
                                                {galleries.length !== 1
                                                    ? "s"
                                                    : ""}{" "}
                                                360°
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* CSS grid compartido */}
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

                                {/* ── SECCIÓN PDFs ── */}
                                {hasResources && (
                                    <div
                                        style={{
                                            marginBottom: hasGalleries
                                                ? "2rem"
                                                : 0,
                                        }}
                                    >
                                        <SectionDivider
                                            label="Recursos PDF"
                                            count={resources.length}
                                        />
                                        <div
                                            className="resource-grid"
                                            style={{ marginTop: "1rem" }}
                                        >
                                            {resources.map((resource, i) => {
                                                const isLastOdd =
                                                    resources.length % 2 !==
                                                        0 &&
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
                                    </div>
                                )}

                                {/* ── SECCIÓN GALERÍAS 360° ── */}
                                {hasGalleries && (
                                    <div>
                                        <SectionDivider
                                            label="Galerías 360°"
                                            count={galleries.length}
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "1.25rem",
                                                marginTop: "1rem",
                                            }}
                                        >
                                            {galleries.map((gallery) => (
                                                <GalleryCard
                                                    key={gallery.id}
                                                    gallery={gallery}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sin contenido */}
                                {!hasResources && !hasGalleries && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            color: "#cbd5e1",
                                            padding: "3rem",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Este servicio no tiene recursos
                                        registrados.
                                    </div>
                                )}

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
                            flexWrap: "wrap", // ← los botones bajan a la siguiente fila
                            justifyContent: "center", // ← centrados horizontalmente
                            gap: "0.875rem",
                            maxWidth: "680px", // ← contenedor máximo
                            margin: "0 auto",
                            padding: "1rem 0 2.5rem",
                        }}
                    >
                        {services.map((service, i) => {
                            const palette = getColor(i); // ← usa la nueva función
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
                                        // Tamaño según el texto, con límites
                                        width: "fit-content", // ← se adapta al texto
                                        minWidth: "140px", // ← mínimo para textos cortos
                                        maxWidth: "300px", // ← máximo para textos largos
                                        whiteSpace: "nowrap", // ← evita que el texto se parta
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
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
