// resources/js/Pages/Resource/Design/Edit.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState } from "react";

export default function Edit({ resource, services }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        service_id: resource.service_id ?? "",
        title: resource.title ?? "",
        categories: resource.categories ?? [],
        order: resource.order ?? 0,
        orientation: resource.orientation ?? "vertical",
        pdf: null,
    });

    const [pdfName, setPdfName] = useState(null);

    const handleAddCategory = () =>
        setData("categories", [...data.categories, ""]);

    const handleChangeCategory = (index, value) => {
        const updated = [...data.categories];
        updated[index] = value;
        setData("categories", updated);
    };

    const handleRemoveCategory = (index) => {
        const updated = [...data.categories];
        updated.splice(index, 1);
        setData("categories", updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("resource.update", { resource: resource.id }), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Editar Recurso - Bimetica" />
            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-semibold leading-tight text-gray-800">
                        Editar recurso
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
                                value="Título del recurso (opcional)"
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

                        {/* CATEGORÍAS */}
                        <div>
                            <InputLabel value="Categorías (opcional)" />
                            {data.categories.map((cat, index) => (
                                <div key={index} className="flex flex-col mt-2">
                                    <div className="flex gap-2">
                                        <TextInput
                                            className="flex-1"
                                            placeholder="Ej: Plantas arquitectónicas"
                                            value={cat}
                                            onChange={(e) =>
                                                handleChangeCategory(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveCategory(index)
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                                        >
                                            X
                                        </button>
                                    </div>
                                    <InputError
                                        className="mt-1"
                                        message={errors[`categories.${index}`]}
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                className="mt-2 text-indigo-600 hover:underline text-sm"
                            >
                                + Añadir categoría
                            </button>
                        </div>

                        {/* ORIENTACIÓN */}
                        <div>
                            <InputLabel value="Orientación del PDF" />
                            <div className="mt-2 flex gap-6">
                                {["vertical", "horizontal"].map((ori) => (
                                    <label
                                        key={ori}
                                        className="flex items-center gap-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="orientation"
                                            value={ori}
                                            checked={data.orientation === ori}
                                            onChange={(e) =>
                                                setData(
                                                    "orientation",
                                                    e.target.value,
                                                )
                                            }
                                            className="text-indigo-600"
                                        />
                                        <span className="capitalize text-sm text-gray-700">
                                            {ori === "vertical"
                                                ? "📄 Vertical (Portrait)"
                                                : "📰 Horizontal (Landscape)"}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <InputError
                                className="mt-2"
                                message={errors.orientation}
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
                        </div>

                        {/* PDF ACTUAL */}
                        {resource.pdf && !pdfName && (
                            <div>
                                <InputLabel value="PDF actual" />
                                <a
                                    href={route("resource.pdf", {
                                        resource: resource.id,
                                    })}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 underline text-sm"
                                >
                                    Ver PDF actual →
                                </a>
                            </div>
                        )}

                        {/* NUEVO PDF */}
                        <div>
                            <InputLabel
                                value={
                                    resource.pdf
                                        ? "Reemplazar PDF (opcional)"
                                        : "Archivo PDF *"
                                }
                            />
                            <div
                                className={`mt-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
                                    ${pdfName ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400"}`}
                                onClick={() =>
                                    document
                                        .getElementById("dropzonePdfEdit")
                                        .click()
                                }
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file?.type === "application/pdf") {
                                        setData("pdf", file);
                                        setPdfName(file.name);
                                    }
                                }}
                            >
                                <input
                                    id="dropzonePdfEdit"
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setData("pdf", file);
                                        if (file) setPdfName(file.name);
                                    }}
                                />
                                {!pdfName ? (
                                    <p className="text-gray-500">
                                        Arrastra un PDF aquí o{" "}
                                        <span className="text-indigo-600 underline">
                                            haz clic para subir
                                        </span>
                                    </p>
                                ) : (
                                    <div className="flex items-center justify-center gap-2 text-indigo-700 font-medium">
                                        <span>📄</span>
                                        <span>{pdfName}</span>
                                    </div>
                                )}
                            </div>
                            <InputError className="mt-2" message={errors.pdf} />
                        </div>

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing} type="submit">
                                Actualizar recurso
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
