import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CustomDataTable from "@/Components/ui/CustomDataTable";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    IconEye,
    IconImage,
    IconPDF,
    IconPencil,
    IconTrash,
} from "@/Icons/icons";
import ProjectViewModal from "@/Components/ui/ProjectViewModal";
import { useState } from "react";
import ModalConfirm from "@/Components/ui/ModalConfirm";
import { router } from "@inertiajs/react";

export default function List({ auth, projects }) {
    console.log(projects);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    /* ===============================
       MODAL DE CONFIRMACION
    =============================== */
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const openDeleteModal = (project) => {
        setProjectToDelete(project);
        setIsConfirmOpen(true);
    };

    const closeDeleteModal = () => {
        setProjectToDelete(null);
        setIsConfirmOpen(false);
    };

    const confirmDelete = () => {
        if (!projectToDelete) return;

        router.delete(route("project.destroy", projectToDelete.slug), {
            onSuccess: () => {
                closeDeleteModal();
            },
        });
    };

    /* ===============================
       ABRIR / CERRAR MODAL
    =============================== */
    const openModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    /* ===============================
       COLUMNAS
    =============================== */
    const columnas = [
        { campo: "Título" },
        { campo: "Categoría" },
        { campo: "Estado" },
        { campo: "PDF" },
        { campo: "Galería 360°" },
        { campo: "Fecha" },
        { campo: "Acciones" },
    ];

    /* ===============================
       DATA TABLA
    =============================== */
    const contenidoTabla = projects?.map((project) => [
        /* Título */
        <div>
            <p className="font-medium text-gray-900">{project.title}</p>
            <p className="text-xs text-gray-400">{project.slug}</p>
        </div>,

        /* Categoría */
        project.category ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {project.category}
            </span>
        ) : (
            <span className="text-gray-300 text-xs">—</span>
        ),

        /* Estado */
        <StatusBadge status={project.status} />,

        /* PDF */
        project.pdf_path ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">
                <IconPDF />
                <span className="text-gray-400 capitalize">
                    ({project.orientation})
                </span>
            </span>
        ) : (
            <span className="text-gray-300 text-xs">Sin PDF</span>
        ),

        /* Galería */
        project.gallery_count > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                <IconImage /> {project.gallery_count} imagen
                {project.gallery_count !== 1 ? "es" : ""}
            </span>
        ) : (
            <span className="text-gray-300 text-xs">Sin galería</span>
        ),

        /* Fecha */
        <span className="text-sm text-gray-500">
            {new Date(project.created_at).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })}
        </span>,

        /* Acciones */
        <div className="flex gap-2">
            {/* <button
                onClick={() => openModal(project)}
                className="text-white bg-blue-600 p-1 rounded-md"
            >
                <IconEye />
            </button> */}
            <Link
                href={route("project.show", project.slug)}
                className="text-white bg-blue-600 p-1 rounded-md"
            >
                <IconEye />
            </Link>
            <Link
                href={route("project.edit", project.slug)}
                className="bg-yellow-500 text-white p-1 rounded-md"
            >
                <IconPencil />
            </Link>
            <button
                onClick={() => openDeleteModal(project)}
                className="bg-red-600 text-white p-1 rounded-md"
            >
                <IconTrash />
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

            {/* Modal visor PDF */}
            <ProjectViewModal
                isOpen={isModalOpen}
                closeModal={closeModal}
                project={selectedProject}
            />

            {/* Modal Confirm */}
            <ModalConfirm
                isOpen={isConfirmOpen}
                closeModal={closeDeleteModal}
                onConfirm={confirmDelete}
                title="Eliminar Proyecto"
                message={
                    projectToDelete
                        ? `¿Seguro que deseas eliminar el proyecto "${projectToDelete.title}"? Esta acción no se puede deshacer.`
                        : ""
                }
            />
        </AuthenticatedLayout>
    );
}

/* ===============================
   BADGE DE ESTADO
=============================== */
function StatusBadge({ status }) {
    const map = {
        "En proceso": "bg-yellow-100 text-yellow-800",
        "En construcción": "bg-orange-100 text-orange-800",
        Completado: "bg-green-100 text-green-800",
        Pausado: "bg-gray-100 text-gray-600",
        Cancelado: "bg-red-100 text-red-700",
    };

    const cls = map[status] ?? "bg-gray-100 text-gray-500";

    return status ? (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}
        >
            {status}
        </span>
    ) : (
        <span className="text-gray-300 text-xs">—</span>
    );
}
