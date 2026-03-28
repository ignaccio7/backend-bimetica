// resources/js/Pages/PublicProject/List.jsx
import { Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CustomDataTable from "@/Components/ui/CustomDataTable";
import PrimaryButton from "@/Components/PrimaryButton";
import { IconPencil, IconTrash } from "@/Icons/icons";

export default function List({ auth, projects }) {
    const columnas = [
        { campo: "Imagen" },
        { campo: "Nombre del Proyecto" },
        { campo: "Estado" },
        { campo: "Acciones" },
    ];

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de eliminar este proyecto?")) {
            router.delete(route("public-project.destroy", id));
        }
    };

    const contenidoTabla = projects?.map((project) => [
        <img
            src={project.image_url}
            alt={project.name}
            className="h-14 w-20 object-cover rounded-md border border-gray-200"
        />,
        <span className="font-medium">{project.name}</span>,
        <>
            {project.status === "active" ? (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Activo
                </span>
            ) : (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Inactivo
                </span>
            )}
        </>,
        <div className="flex gap-2">
            <Link
                href={route("public-project.edit", project.id)}
                className="text-white hover:bg-blue-500 text-sm font-medium bg-blue-600 p-1 rounded-md transition-colors duration-300"
            >
                <IconPencil />
            </Link>
            <button
                onClick={() => handleDelete(project.id)}
                className="text-white hover:bg-red-500 text-sm font-medium bg-red-600 p-1 rounded-md transition-colors duration-300"
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
                        titulo="Proyectos Públicos"
                        subtitulo="Imágenes de proyectos visibles en la landing page"
                        acciones={[
                            <Link
                                href={route("public-project.create")}
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
                                <Link href={route("public-project.create")}>
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
        </AuthenticatedLayout>
    );
}
