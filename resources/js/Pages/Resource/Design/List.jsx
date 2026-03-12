// resources/js/Pages/Resource/Design/List.jsx
import CustomDataTable from "@/Components/ui/CustomDataTable";
import ModalConfirm from "@/Components/ui/ModalConfirm";
import Pagination from "@/Components/ui/Pagination";
import { IconPencil, IconTrash } from "@/Icons/icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function List({ resources }) {
    const [modal, setModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    const deleteResource = () => {
        if (!selectedResource) return;
        router.delete(
            route("resource.destroy", { resource: selectedResource.id }),
            {
                onSuccess: () => {
                    closeModal();
                },
            },
        );
    };

    const columnas = [
        { campo: "Servicio" },
        { campo: "Título" },
        { campo: "Categorías" },
        { campo: "Orden" },
        { campo: "PDF" },
        { campo: "Opciones" },
    ];

    const contenidoTabla = resources?.data?.map((resource) => [
        resource.service?.title ?? "—",

        resource.title ?? "—",

        <ul className="list-disc pl-5 marker:text-secondary-500">
            {resource.categories?.map((cat) => (
                <li key={cat}>{cat}</li>
            ))}
        </ul>,

        resource.order,

        // El PDF es privado, se sirve por ruta autenticada
        <a
            href={route("resource.pdf", { resource: resource.id })}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline text-sm"
        >
            Ver PDF
        </a>,

        <div className="actions flex flex-row md:flex-col gap-2 justify-start md:justify-center items-center">
            <Link
                href={route("resource.edit", { resource: resource.id })}
                className="px-2 py-1 bg-green-700 text-white rounded-md flex justify-center hover:bg-green-500 transition-colors duration-200"
            >
                <IconPencil />
            </Link>
            <button
                onClick={() => {
                    openModal();
                    setSelectedResource(resource);
                }}
                className="px-2 py-1 bg-red-700 text-white rounded-md flex justify-center hover:bg-red-500 transition-colors duration-200"
            >
                <IconTrash />
            </button>
        </div>,
    ]);

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Recursos - Bimetica" />
                <div className="py-6">
                    <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                        <div className="px-2 sm:px-0">
                            <CustomDataTable
                                titulo={"Gestionar recursos"}
                                subtitulo={
                                    "Administra los recursos del sistema"
                                }
                                acciones={[
                                    <Link
                                        href={route("resource.create")}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-500 transition-colors duration-200"
                                    >
                                        + Nuevo recurso
                                    </Link>,
                                ]}
                                columnas={columnas}
                                contenidoTabla={contenidoTabla}
                                paginacion={
                                    <Pagination
                                        currentPage={resources.current_page}
                                        lastPage={resources.last_page}
                                        routeName="resource.index"
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
            <ModalConfirm
                isOpen={modal}
                closeModal={closeModal}
                onConfirm={deleteResource}
                title={"¿Eliminar recurso?"}
                message={`¿Estás seguro que quieres eliminar este recurso? Esta acción no se puede deshacer.`}
            />
        </>
    );
}
