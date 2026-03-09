import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import PdfToImages from "@/Components/ui/PdfToImages";
import Magazine from "@/Pages/Project/components/Magazine";

const RESOURCES = [
    {
        title: "Casa Modelo",
        file: "/pdfs/MODELOS-2025-PLUSVALY2.pdf",
        orientation: "vertical",
        color: "#9AC72D",
        hover: "#7E9B1F",
    },
    {
        title: "Items Acabados",
        file: "/pdfs/MODELOS-2025-PLUSVALY3.pdf",
        orientation: "vertical",
        color: "#3E55B4",
        hover: "#2E4090",
    },
    {
        title: "Permisos de Construcción El Alto",
        file: "/pdfs/MODELOS-2025-PLUSVALY4.pdf",
        orientation: "vertical",
        color: "#1D2753",
        hover: "#141C3A",
    },
];

export default function Resources({ auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        setImages([]);
    }, [selectedResource]);

    const openModal = (resource) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedResource(null);
        setImages([]);
    };

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
                    <section
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <header>
                            <h1
                                style={{
                                    textAlign: "center",
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                    color: "#9AC72D",
                                }}
                            >
                                Nuestros recursos
                            </h1>
                            <p
                                style={{
                                    textAlign: "center",
                                    maxWidth: "36rem",
                                    margin: "0 auto",
                                }}
                            >
                                Base de datos de nuestros brokers.
                            </p>
                        </header>
                    </section>

                    <section
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "2.5rem 0",
                            gap: "1.25rem",
                        }}
                    >
                        {RESOURCES.map((resource) => (
                            <button
                                key={resource.file}
                                onClick={() => openModal(resource)}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        resource.hover)
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.backgroundColor =
                                        resource.color)
                                }
                                style={{
                                    backgroundColor: resource.color,
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
                                {resource.title}
                            </button>
                        ))}
                    </section>
                </div>
            </div>

            {/* Modal revista — igual que ProjectViewModal pero con URL directa */}
            <Transition show={isModalOpen} as={Fragment}>
                <Dialog
                    as="div"
                    style={{ position: "relative", zIndex: 50 }}
                    onClose={closeModal}
                >
                    {/* Fondo */}
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
                                backgroundColor: "rgba(0,0,0,0.5)",
                            }}
                        />
                    </TransitionChild>

                    {/* Contenedor */}
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            overflowY: "auto",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                minHeight: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "1rem",
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
                                        padding: "1.5rem",
                                        boxShadow:
                                            "0 20px 60px rgba(0,0,0,0.3)",
                                    }}
                                >
                                    <DialogTitle
                                        style={{
                                            fontSize: "1.25rem",
                                            fontWeight: "600",
                                            marginBottom: "1rem",
                                        }}
                                    >
                                        {selectedResource?.title}
                                    </DialogTitle>

                                    {/* Convierte PDF a imágenes — URL directa al archivo estático */}
                                    {isModalOpen && selectedResource && (
                                        <PdfToImages
                                            pdfUrl={selectedResource.file}
                                            onLoad={(imgs) => setImages(imgs)}
                                        />
                                    )}

                                    {/* Revista */}
                                    {images.length > 0 && (
                                        <Magazine
                                            images={images}
                                            orientation={
                                                selectedResource?.orientation ??
                                                "vertical"
                                            }
                                        />
                                    )}

                                    <div
                                        style={{
                                            marginTop: "1.5rem",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <button
                                            onClick={closeModal}
                                            style={{
                                                padding: "0.5rem 1rem",
                                                backgroundColor: "#4b5563",
                                                color: "#fff",
                                                borderRadius: "0.375rem",
                                                border: "none",
                                                cursor: "pointer",
                                                fontWeight: "600",
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
        </AuthenticatedLayout>
    );
}
