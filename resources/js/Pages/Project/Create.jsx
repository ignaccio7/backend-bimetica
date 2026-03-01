import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function CreateProject({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        pdf: null,
    });

    const submit = (event) => {
        event.preventDefault();

        post(route("project.store"), {
            forceFormData: true, // IMPORTANTE para archivos
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Crear Proyecto
                </h2>
            }
        >
            <div className="py-0">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-0">
                    <Head title="Crear Proyecto" />

                    <div className="py-6">
                        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                                <form
                                    onSubmit={submit}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {/* Título */}
                                    <div>
                                        <InputLabel value="Título" />
                                        <TextInput
                                            className="mt-1 block w-full"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            placeholder="Proyecto inmobiliario 2026"
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    {/* Descripción */}
                                    <div className="md:col-span-2">
                                        <InputLabel value="Descripción" />
                                        <textarea
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="4"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Descripción del proyecto..."
                                        />
                                        <InputError
                                            message={errors.description}
                                        />
                                    </div>

                                    {/* PDF */}
                                    <div className="md:col-span-2">
                                        <InputLabel value="Archivo PDF" />
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "pdf",
                                                    e.target.files[0],
                                                )
                                            }
                                        />
                                        <InputError message={errors.pdf} />
                                    </div>

                                    <PrimaryButton
                                        disabled={processing}
                                        type="submit"
                                        className="w-fit px-6 col-span-1 md:col-span-2"
                                    >
                                        Crear Proyecto
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
