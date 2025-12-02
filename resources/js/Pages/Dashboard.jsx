import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 flex flex-col gap-1">
                    Bienvenid@
                    <small className="text-gray-500 text-step-1 font-normal">
                        Tienes acceso a los siguientes modulos
                    </small>
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Aqui deberian ir los modulos
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
