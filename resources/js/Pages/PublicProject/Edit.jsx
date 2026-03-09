// resources/js/Pages/PublicProject/Edit.jsx
import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Edit({ auth, project }) {
    const [preview, setPreview] = useState(project.image_url);

    const { data, setData, post, processing, errors } = useForm({
        name: project.name,
        image: null,
        _method: "PUT",
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
        // Usamos post con _method=PUT para enviar multipart/form-data
        post(route("public-project.update", project.id), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Editar Proyecto Público
                </h2>
            }
        >
            <Head title="Editar Proyecto Público" />

            <div className="py-6">
                <div className="mx-auto max-w-2xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Nombre */}
                            <div>
                                <InputLabel value="Nombre del Proyecto" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Imagen actual */}
                            {preview && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">
                                        Imagen actual:
                                    </p>
                                    <img
                                        src={preview}
                                        alt={project.name}
                                        className="h-48 w-full object-cover rounded-md border border-gray-200"
                                    />
                                </div>
                            )}

                            {/* Nueva imagen (opcional) */}
                            <div>
                                <InputLabel value="Cambiar imagen (opcional)" />
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleImageChange}
                                    className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                <InputError message={errors.image} />
                            </div>

                            <PrimaryButton
                                disabled={processing}
                                type="submit"
                                className="w-fit px-6"
                            >
                                Guardar Cambios
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
