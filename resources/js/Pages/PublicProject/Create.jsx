// resources/js/Pages/PublicProject/Create.jsx
import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Create({ auth }) {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        image: null,
        status: "active",
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("public-project.store"), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Crear Proyecto Público
                </h2>
            }
        >
            <Head title="Crear Proyecto Público" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                {/* Nombre */}
                                <div className="col-span-1 md:col-span-3">
                                    <InputLabel value="Nombre del Proyecto" />
                                    <TextInput
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        placeholder="Ej: Edificio Central"
                                    />
                                    <InputError message={errors.name} />
                                </div>
                                {/* ===== ESTADO ===== */}
                                <div>
                                    <InputLabel value="Estado" />
                                    <select
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option key="active" value="active">
                                            Activo
                                        </option>
                                        <option key="disabled" value="disabled">
                                            Inactivo
                                        </option>
                                    </select>
                                    <InputError message={errors.status} />
                                </div>
                            </div>

                            {/* Imagen */}
                            <div>
                                <InputLabel value="Imagen del Proyecto" />
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                <InputError message={errors.image} />
                            </div>

                            {/* Preview */}
                            {preview && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Vista previa:
                                    </p>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-48 w-full object-cover rounded-md border border-gray-200"
                                    />
                                </div>
                            )}

                            <PrimaryButton
                                disabled={processing}
                                type="submit"
                                className="w-fit px-6"
                            >
                                Crear Proyecto
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
