import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CustomDataTable from "@/Components/ui/CustomDataTable";
import PrimaryButton from "@/Components/PrimaryButton";
import { IconEye } from "@/Icons/icons";
import ProjectViewModal from "@/Components/ui/ProjectViewModal";
import { useState, useEffect } from "react";
import Magazine from "./components/Magazine";
import PdfToImages from "@/Components/ui/PdfToImages";

export default function List({ auth, projects }) {
    console.log(projects);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [images, setImages] = useState([]);

    /* ===============================
       ABRIR MODAL
    =============================== */
    const openModal = (project) => {
        console.log("abriendo modal");
        console.log(project);

        setImages([]); // limpiar imágenes anteriores
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    /* ===============================
       CERRAR MODAL
    =============================== */
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
        setImages([]);
    };

    /* ===============================
       COLUMNAS
    =============================== */
    const columnas = [
        { campo: "Título" },
        { campo: "Slug" },
        { campo: "Fecha" },
        { campo: "Acciones" },
    ];

    /* ===============================
       DATA TABLA
    =============================== */
    const contenidoTabla = projects?.map((project) => [
        <span className="font-medium">{project.title}</span>,
        <span className="text-gray-500">{project.slug}</span>,
        <span>{new Date(project.created_at).toLocaleDateString()}</span>,
        <div className="flex gap-2">
            <button
                onClick={() => openModal(project)}
                className="text-white hover:bg-blue-500 text-sm font-medium bg-blue-600 p-1 rounded-md transition-colors duration-300"
            >
                <IconEye />
            </button>
        </div>,
    ]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <CustomDataTable
                        titulo="Gestión de Proyectos"
                        subtitulo="Administra los proyectos registrados"
                        acciones={[
                            <Link
                                href={route("project.create")}
                                className="inline-flex items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900"
                            >
                                + Nuevo Proyecto
                            </Link>,
                        ]}
                        columnas={columnas}
                        contenidoTabla={contenidoTabla}
                        numeracion={true}
                        contenidoCuandoVacio={
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">
                                    No hay proyectos registrados
                                </p>
                                <Link href={route("project.create")}>
                                    <PrimaryButton>
                                        Crear primer proyecto
                                    </PrimaryButton>
                                </Link>
                            </div>
                        }
                        cargando={false}
                        error={false}
                    />
                </div>
            </div>

            {/* ===============================
               MODAL VISOR PDF
            =============================== */}
            <ProjectViewModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                project={selectedProject}
            />
        </AuthenticatedLayout>
    );
}
