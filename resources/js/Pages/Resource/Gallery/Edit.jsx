// resources/js/Pages/Resource/Gallery/Edit.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState } from "react";

export default function Edit({ gallery, services }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        service_id: gallery.service_id ?? "",
        title: gallery.title ?? "",
        order: gallery.order ?? 0,
        images: [],
    });

    const [existingImages, setExistingImages] = useState(
        gallery.image_urls ?? [],
    );
    const [newPreviews, setNewPreviews] = useState([]);
    const [deletingIndex, setDeletingIndex] = useState(null);

    const handleImages = (e) => {
        const incoming = Array.from(e.target.files);
        setData("images", [...data.images, ...incoming]);
        setNewPreviews((prev) => [
            ...prev,
            ...incoming.map((f) => URL.createObjectURL(f)),
        ]);
        e.target.value = "";
    };

    const removeNewImage = (i) => {
        setData(
            "images",
            data.images.filter((_, idx) => idx !== i),
        );
        setNewPreviews(newPreviews.filter((_, idx) => idx !== i));
    };

    const deleteExisting = (serverIndex) => {
        if (!confirm("¿Eliminar esta imagen?")) return;
        setDeletingIndex(serverIndex);
        router.delete(
            route("resource-gallery.image.destroy", {
                resourceGallery: gallery.id,
                index: serverIndex,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setExistingImages((prev) => {
                        const filtered = prev.filter(
                            (img) => img.index !== serverIndex,
                        );
                        const bust = Date.now();
                        return filtered.map((img, i) => ({
                            index: i,
                            url:
                                route("resource-gallery.image", {
                                    gallery: gallery.id,
                                    index: i,
                                }) + `?t=${bust}`,
                        }));
                    });
                    setDeletingIndex(null);
                },
                onError: () => setDeletingIndex(null),
            },
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(
            route("resource-gallery.update", { resourceGallery: gallery.id }),
            {
                forceFormData: true,
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Galería - Bimetica" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-semibold leading-tight text-gray-800">
                        Editar galería 360°
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
                                value="Título (opcional)"
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
                            <InputLabel htmlFor="order" value="Orden" />
                            <TextInput
                                id="order"
                                type="number"
                                className="mt-1 block w-32"
                                value={data.order}
                                onChange={(e) =>
                                    setData("order", e.target.value)
                                }
                            />
                        </div>

                        {/* IMÁGENES EXISTENTES */}
                        {existingImages.length > 0 && (
                            <div>
                                <InputLabel value="Imágenes actuales" />
                                <p className="text-xs text-gray-500 mb-2">
                                    Clic en ✕ para eliminar del servidor
                                </p>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    {existingImages.map((img) => (
                                        <div
                                            key={img.index}
                                            className="relative group"
                                        >
                                            <img
                                                src={img.url}
                                                alt={`img-${img.index}`}
                                                className="w-full h-20 object-cover rounded-md border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                disabled={
                                                    deletingIndex === img.index
                                                }
                                                onClick={() =>
                                                    deleteExisting(img.index)
                                                }
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
                                            >
                                                {deletingIndex === img.index
                                                    ? "…"
                                                    : "×"}
                                            </button>
                                            <p className="text-xs text-center text-gray-400 mt-1">
                                                #{img.index + 1}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AGREGAR MÁS IMÁGENES */}
                        <div>
                            <InputLabel value="Agregar más imágenes" />
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

                            {newPreviews.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                    {newPreviews.map((src, i) => (
                                        <div key={i} className="relative group">
                                            <img
                                                src={src}
                                                alt={`new-${i}`}
                                                className="w-full h-20 object-cover rounded-md border-2 border-green-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeNewImage(i)
                                                }
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ×
                                            </button>
                                            <p className="text-xs text-center text-green-500 mt-1 font-medium">
                                                nuevo
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing} type="submit">
                                Actualizar galería
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
