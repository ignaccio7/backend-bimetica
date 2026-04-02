import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Edit({ gallery, services }) {
    const { data, setData, put, processing, errors } = useForm({
        service_id: gallery.service_id ?? "",
        title: gallery.title ?? "",
        order: gallery.order ?? 0,
        kuula_id: gallery.kuula_id ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("resource-gallery.update", { resourceGallery: gallery.id }));
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

                        {/* KUULA ID */}
                        <div>
                            <InputLabel
                                htmlFor="kuula_id"
                                value="ID de colección Kuula *"
                            />
                            <TextInput
                                id="kuula_id"
                                className="mt-1 block w-full"
                                placeholder="Ej: 5yXAN"
                                value={data.kuula_id}
                                onChange={(e) =>
                                    setData("kuula_id", e.target.value)
                                }
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Es el código que aparece en la URL de Kuula:{" "}
                                <code className="bg-gray-100 px-1 rounded">
                                    kuula.co/share/collection/
                                    <strong>5yXAN</strong>
                                </code>
                            </p>
                            <InputError
                                className="mt-2"
                                message={errors.kuula_id}
                            />

                            {/* Preview */}
                            {data.kuula_id && (
                                <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                                    <iframe
                                        width="100%"
                                        height="400"
                                        frameBorder="0"
                                        allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
                                        allowFullScreen
                                        scrolling="no"
                                        src={`https://kuula.co/share/collection/${data.kuula_id}?logo=0&info=0&fs=1&vr=0&sd=1&thumbs=1`}
                                    />
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
