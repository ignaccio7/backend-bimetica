// resources/js/Pages/Users/Index.jsx
import { Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CustomDataTable from "@/Components/ui/CustomDataTable";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Index(
    // { auth, users } = { auth: {}, users: { data: [] } }
    { auth, users },
) {
    console.log(users);

    // 1️⃣ DEFINIR COLUMNAS (headers)
    const columnas = [
        { campo: "Nombre" },
        { campo: "Usuario" },
        { campo: "Rol" },
        { campo: "Estado" },
        { campo: "Acciones" },
    ];

    // 2️⃣ FUNCIÓN PARA ELIMINAR
    const handleDelete = (userId) => {
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            router.delete(route("user.destroy", userId));
        }
    };

    // 3️⃣ TRANSFORMAR DATA A MATRIZ DE ReactNode[][]
    // Cada array interno es UNA FILA
    // Cada elemento es UNA CELDA (debe coincidir con columnas)
    const contenidoTabla = users?.map((user) => [
        <span className="font-medium">{user.name}</span>,
        <span>{user.username}</span>,
        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            {user.role}
        </span>,
        <span
            className={`px-2 py-1 text-xs rounded-full ${
                user.status
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
            }`}
        >
            {user.status ? "Activo" : "Inactivo"}
        </span>,
        <div className="flex gap-2">
            {/* <Link
                    href={route("users.edit", user.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                </Link> */}
            Editar
            <button
                onClick={() => handleDelete(user.id)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
                Eliminar
            </button>
        </div>,
    ]);
    console.log(contenidoTabla);

    // const contenidoTabla = [[<></>, <></>, <></>, <></>, <></>]];

    // 4️⃣ COMPONENTE DE PAGINACIÓN (opcional)
    // const Paginacion = () => (
    //     <div className="flex justify-between items-center">
    //         <span className="text-sm text-gray-600">
    //             {/* Mostrando {users.from} a {users.to} de {users.total} registros */}
    //             Mostrando registros
    //         </span>
    //         <div className="flex gap-2">
    //             {/* {users.links.map((link, index) => (
    //                 <Link
    //                     key={index}
    //                     href={link.url || "#"}
    //                     className={`px-3 py-1 text-sm rounded ${
    //                         link.active
    //                             ? "bg-blue-600 text-white"
    //                             : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    //                     }`}
    //                     dangerouslySetInnerHTML={{ __html: link.label }}
    //                 />
    //             ))} */}
    //         </div>
    //     </div>
    // );

    // const createUser = () => {
    //     router.get(route("user.create"));
    // };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <CustomDataTable
                        titulo="Gestión de Usuarios"
                        subtitulo="Administra los usuarios del sistema"
                        // Acciones superiores (botones globales)
                        // <Link href={route("users.create")}>
                        // </Link>,
                        acciones={[
                            <Link
                                href={route("user.create")}
                                className={`inline-flex items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900`}
                            >
                                {/* <PrimaryButton onClick={createUser}> */}+
                                Nuevo Usuario
                            </Link>,
                        ]}
                        columnas={columnas}
                        contenidoTabla={contenidoTabla}
                        // Paginación
                        // paginacion={<Paginacion />}
                        // Numeración automática
                        numeracion={true}
                        // Mensaje cuando está vacío
                        contenidoCuandoVacio={
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">
                                    No hay usuarios registrados
                                </p>
                                <PrimaryButton>
                                    Crear primer usuario
                                </PrimaryButton>
                                {/* <Link href={route("users.create")}>
                                </Link> */}
                            </div>
                        }
                        // Estados
                        cargando={false}
                        error={false}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
