// resources/js/Pages/Resource/Gallery/Create.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Transition } from "@headlessui/react";
import { useState } from "react";

export default function Create({ services }) {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            service_id: "",
            title: "",
            order: 0,
            images: [],
        });

    const [previews, setPreviews] = useState([]);

    const handleImages = (e) => {
        const incoming = Array.from(e.target.files);
        const updated = [...data.images, ...incoming];
        setData("images", updated);
        setPreviews((prev) => [
            ...prev,
            ...incoming.map((f) => URL.createObjectURL(f)),
        ]);
        e.target.value = "";
    };

    const removeImage = (index) => {
        setData(
            "images",
            data.images.filter((_, i) => i !== index),
        );
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("resource-gallery.store"), { forceFormData: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Crear Galería - Bimetica" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-semibold leading-tight text-gray-800">
                        Crear nueva galería 360°
                    </h1>
                    <form
                        onSubmit={submit}
                        className="mt-6 border border-gray-200 p-6 rounded-xl shadow-sm space-y-6 bg-white"
                    >
                        {/* SERVICIO */}
                        <div>
                            <InputLabel
                                htmlFor="service_id"
                                value="Servicio asociado *"
                            />
                            <select
                                id="service_id"
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.service_id}
                                onChange={(e) =>
                                    setData("service_id", e.target.value)
                                }
                            >
                                <option value="">
                                    Seleccione un servicio...
                                </option>
                                {services.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.title}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                className="mt-2"
                                message={errors.service_id}
                            />
                        </div>

                        {/* TÍTULO */}
                        <div>
                            <InputLabel
                                htmlFor="title"
                                value="Título de la galería (opcional)"
                            />
                            <TextInput
                                id="title"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            <InputError
                                className="mt-2"
                                message={errors.title}
                            />
                        </div>

                        {/* ORDEN */}
                        <div>
                            <InputLabel
                                htmlFor="order"
                                value="Orden de visualización"
                            />
                            <TextInput
                                id="order"
                                type="number"
                                className="mt-1 block w-32"
                                value={data.order}
                                onChange={(e) =>
                                    setData("order", e.target.value)
                                }
                            />
                            <InputError
                                className="mt-2"
                                message={errors.order}
                            />
                        </div>

                        {/* IMÁGENES */}
                        <div>
                            <InputLabel value="Imágenes equirectangulares 360° *" />
                            <p className="text-xs text-gray-500 mb-2">
                                JPG, PNG o WEBP — máx. 20MB por imagen
                            </p>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                onChange={handleImages}
                            />
                            <InputError
                                className="mt-2"
                                message={errors.images}
                            />

                            {previews.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    {previews.map((src, i) => (
                                        <div key={i} className="relative group">
                                            <img
                                                src={src}
                                                alt={`preview-${i}`}
                                                className="w-full h-20 object-cover rounded-md border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(i)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                            <p className="text-xs text-center text-gray-400 mt-1">
                                                #{i + 1}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SUBMIT */}
                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing} type="submit">
                                Registrar galería
                            </PrimaryButton>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out duration-200"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out duration-500"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600">
                                    Guardado.
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
