import PrimaryButton from "@/Components/PrimaryButton";
import CustomDataTable from "@/Components/ui/CustomDataTable";
import Pagination from "@/Components/ui/Pagination";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function List({ services }) {
    console.log(services);

    const columnas = [
        { campo: "Titulo" },
        { campo: "Descripción" },
        { campo: "Categoría" },
        { campo: "Beneficios" },
        { campo: "Imagen" },
    ];

    const contenidoTabla = services?.data?.map((service) => {
        const imageUrl = (service?.image).startsWith("http")
            ? service.image
            : `/storage/${service.image}`;

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
        ];
    });

    // console.log(contenidoTabla);

    return (
        <AuthenticatedLayout>
            <Head title="Servicios - Bimetica" />

            <div className="py-6">
                <div className="actions mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="px-2 sm:px-0">
                        <CustomDataTable
                            titulo={"Gestionar nuestros servicios"}
                            subtitulo={"Administra los servicios del sistema"}
                            acciones={[
                                <PrimaryButton>
                                    Registrar nuevo servicio
                                </PrimaryButton>,
                            ]}
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
    );
}
