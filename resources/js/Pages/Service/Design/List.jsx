import PrimaryButton from "@/Components/PrimaryButton";
import CustomDataTable from "@/Components/ui/CustomDataTable";
import ModalConfirm from "@/Components/ui/ModalConfirm";
import Pagination from "@/Components/ui/Pagination";
import { IconPencil, IconTrash } from "@/Icons/icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function List({ services }) {
    const [modal, setModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const openModal = () => {
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
    };

    const deleteService = async () => {
        if (!selectedService) return;

        router.delete(
            route("service.destroy", {
                service: selectedService.slug,
            }),
            {
                onSuccess: () => {
                    console.log("Servicio eliminado");
                    closeModal();
                },
            }
        );
    };

    const columnas = [
        { campo: "Titulo" },
        { campo: "Descripción" },
        { campo: "Categoría" },
        { campo: "Beneficios" },
        { campo: "Imagen" },
        { campo: "Opciones" },
    ];

    const contenidoTabla = services?.data?.map((service) => {
        // console.log(service);

        const imageUrl = service.image
            ? (service?.image).startsWith("http")
                ? service.image
                : `/storage/${service.image}`
            : "";

        return [
            service.title,
            service.description,
            <ul className="list-disc pl-5 marker:text-secondary-500">
                {service.categories?.map((category) => {
                    return <li key={category}>{category}</li>;
                })}
            </ul>,
            <ul className="list-disc pl-5 marker:text-secondary-500">
                {service.benefits?.map((benefit) => {
                    return <li key={benefit}>{benefit}</li>;
                })}
            </ul>,
            <img
                className="rounded-md w-60 h-auto aspect-video"
                src={imageUrl}
                alt={service.title}
            />,
            <div className="actions flex flex-row md:flex-col gap-2 justify-start md:justify-center items-center">
                <Link
                    href={route("service.edit", {
                        service: service.slug,
                    })}
                    className="px-2 py-1 bg-green-700 text-white rounded-md flex justify-center hover:bg-green-500 transition-colors duration-200"
                >
                    <IconPencil />
                </Link>
                <button
                    onClick={() => {
                        openModal();
                        setSelectedService(service);
                    }}
                    className="px-2 py-1 bg-red-700 text-white rounded-md flex justify-center hover:bg-red-500 transition-colors duration-200"
                >
                    <IconTrash />
                </button>
            </div>,
        ];
    });

    // console.log(contenidoTabla);

    return (
        <>
            <AuthenticatedLayout>
                <Head title="Servicios - Bimetica" />

                <div className="py-6">
                    <div className="actions mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                        <div className="px-2 sm:px-0">
                            <CustomDataTable
                                titulo={"Gestionar nuestros servicios"}
                                subtitulo={
                                    "Administra los servicios del sistema"
                                }
                                acciones={
                                    [
                                        // <PrimaryButton>
                                        //     Registrar nuevo servicio
                                        // </PrimaryButton>,
                                    ]
                                }
                                columnas={columnas}
                                contenidoTabla={contenidoTabla}
                                paginacion={
                                    <Pagination
                                        currentPage={services.current_page}
                                        lastPage={services.last_page}
                                        routeName="service.index"
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
                onConfirm={deleteService}
                title={"¿Eliminar servicio?"}
                message={`¿Estás seguro que quieres eliminar? Esta acción no se puede deshacer.`}
            />
        </>
    );
}
