import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import PdfToImages from "@/Components/ui/PdfToImages";
import Magazine from "@/Pages/Project/components/Magazine";

export default function ProjectViewModal({ isOpen, closeModal, project }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        setImages([]);
    }, [project]);

    if (!project) return null;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                    <div className="fixed inset-0 bg-black/50" />
                </TransitionChild>

                {/* Contenedor */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                                <DialogTitle className="text-xl font-semibold mb-4">
                                    {project.title}
                                </DialogTitle>

                                {/* Convertidor PDF */}
                                {isOpen && (
                                    <PdfToImages
                                        pdfUrl={route(
                                            "project.pdf",
                                            project.slug,
                                        )}
                                        onLoad={(imgs) => setImages(imgs)}
                                    />
                                )}

                                {/* Revista */}
                                {images.length > 0 && (
                                    <Magazine images={images} />
                                )}

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
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
