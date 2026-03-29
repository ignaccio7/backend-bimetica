import { Link } from "@inertiajs/react";

export default function Error({ status }) {
    const config = {
        404: {
            title: "Página no encontrada",
            description: "La página que buscas no existe o fue eliminada.",
        },
        500: {
            title: "Error del servidor",
            description: "Algo salió mal en el servidor. Intenta más tarde.",
        },
        403: {
            title: "Acceso denegado",
            description: "No tienes permisos para ver esta página.",
        },
        503: {
            title: "Servicio no disponible",
            description: "El servicio está temporalmente fuera de línea.",
        },
    };

    const { title, description } = config[status] ?? {
        title: "Error inesperado",
        description: "Ocurrió un error inesperado.",
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="text-center">
                <p className="text-4xl font-bold text-primary-500">{status}</p>
                <h1 className="mt-4 text-2xl font-semibold text-gray-800">
                    {title}
                </h1>
                <p className="my-2 text-gray-500">{description}</p>
                <Link
                    href={"/"}
                    className="mt-8 inline-block bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition"
                >
                    Ir al inicio
                </Link>
            </div>
        </div>
    );
}
