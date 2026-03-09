import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

const CATEGORIAS = [
    "Residencial",
    "Comercial",
    "Industrial",
    "Salud",
    "Educación",
    "Hotelería",
    "Infraestructura",
    "Otro",
];

const ESTADOS = [
    "En proceso",
    "En construcción",
    "Completado",
    "Pausado",
    "Cancelado",
];

export default function EditProject({ auth, project }) {
    const [characteristics, setCharacteristics] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    /* ===============================
       FORM — image arranca en null,
       solo se setea si el usuario sube
       un archivo nuevo
    =============================== */
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT", // spoofing para PUT con FormData
        title: project.title || "",
        description: project.description || "",
        category: project.category || "",
        status: project.status || "En proceso",
        orientation: project.orientation || "vertical",
        characteristics: "",
        image: null, // ← nunca string, solo File o null
        pdf: null,
        gallery_equirectangular: [],
    });

    /* ===============================
       CARGAR DATOS INICIALES
    =============================== */
    useEffect(() => {
        if (project.characteristics) {
            const rows = Object.entries(project.characteristics).map(
                ([key, value]) => ({ key, value }),
            );
            setCharacteristics(rows);
            setData("characteristics", JSON.stringify(project.characteristics));
        }

        if (project.gallery_equirectangular?.length > 0) {
            setGalleryPreviews(
                project.gallery_equirectangular.map((_, i) =>
                    route("project.gallery.image", {
                        project: project.slug,
                        index: i,
                    }),
                ),
            );
        }
    }, []);

    /* ===============================
       CARACTERÍSTICAS
    =============================== */
    const addCharacteristic = () => {
        setCharacteristics([...characteristics, { key: "", value: "" }]);
    };

    const updateCharacteristic = (index, field, value) => {
        const updated = characteristics.map((c, i) =>
            i === index ? { ...c, [field]: value } : c,
        );
        setCharacteristics(updated);

        const obj = {};
        updated.forEach(({ key, value }) => {
            if (key.trim()) obj[key.trim()] = value;
        });
        setData("characteristics", JSON.stringify(obj));
    };

    const removeCharacteristic = (index) => {
        const updated = characteristics.filter((_, i) => i !== index);
        setCharacteristics(updated);

        const obj = {};
        updated.forEach(({ key, value }) => {
            if (key.trim()) obj[key.trim()] = value;
        });
        setData("characteristics", JSON.stringify(obj));
    };

    /* ===============================
       GALERÍA NUEVA
    =============================== */
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setData("gallery_equirectangular", files);
        setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
    };

    /* ===============================
       SUBMIT — usa post() con _method:PUT
       para que FormData funcione en Laravel
    =============================== */
    const submit = (e) => {
        e.preventDefault();
        post(route("project.update", { project: project.slug }), {
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Editar Proyecto" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <h2 className="text-xl font-semibold mb-6">
                            Editar Proyecto
                        </h2>

                        <form
                            onSubmit={submit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* TÍTULO */}
                            <div>
                                <InputLabel value="Título *" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* CATEGORÍA */}
                            <div>
                                <InputLabel value="Categoría" />
                                <select
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData("category", e.target.value)
                                    }
                                >
                                    <option value="">
                                        Selecciona una categoría
                                    </option>
                                    {CATEGORIAS.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category} />
                            </div>

                            {/* ESTADO */}
                            <div>
                                <InputLabel value="Estado" />
                                <select
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    {ESTADOS.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            {/* ORIENTACIÓN */}
                            <div>
                                <InputLabel value="Orientación PDF" />
                                <div className="flex gap-6 mt-2">
                                    {["vertical", "horizontal"].map((ori) => (
                                        <label
                                            key={ori}
                                            className="flex gap-2 items-center"
                                        >
                                            <input
                                                type="radio"
                                                value={ori}
                                                checked={
                                                    data.orientation === ori
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "orientation",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <span className="capitalize text-sm text-gray-700">
                                                {ori === "vertical"
                                                    ? "📄 Vertical (Portrait)"
                                                    : "📰 Horizontal (Landscape)"}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.orientation} />
                            </div>

                            {/* DESCRIPCIÓN */}
                            <div className="md:col-span-2">
                                <InputLabel value="Descripción" />
                                <textarea
                                    className="mt-1 block w-full border-gray-300 rounded-md"
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* IMAGEN COVER */}
                            <div className="md:col-span-2">
                                <InputLabel value="Imagen de portada" />

                                {/* Preview de imagen actual (solo lectura) */}
                                {project.image_path && (
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Imagen actual (sube una nueva para
                                            reemplazarla):
                                        </p>
                                        <img
                                            src={route(
                                                "project.cover",
                                                project.slug,
                                            )}
                                            alt="Cover actual"
                                            className="h-40 object-cover rounded-md border border-gray-200"
                                        />
                                    </div>
                                )}

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                                    onChange={(e) =>
                                        // Solo asigna si hay archivo seleccionado
                                        setData(
                                            "image",
                                            e.target.files[0] ?? null,
                                        )
                                    }
                                />
                                <InputError message={errors.image} />
                            </div>

                            {/* CARACTERÍSTICAS */}
                            <div className="md:col-span-2">
                                <InputLabel value="Características" />
                                <p className="text-xs text-gray-500 mb-2">
                                    Ej: Ubicación → La Paz - Bolivia
                                </p>
                                <div className="space-y-2">
                                    {characteristics.map((char, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 items-center"
                                        >
                                            <TextInput
                                                className="w-1/3"
                                                placeholder="Clave (ej: Año)"
                                                value={char.key}
                                                onChange={(e) =>
                                                    updateCharacteristic(
                                                        index,
                                                        "key",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <TextInput
                                                className="flex-1"
                                                placeholder="Valor (ej: 2025)"
                                                value={char.value}
                                                onChange={(e) =>
                                                    updateCharacteristic(
                                                        index,
                                                        "value",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeCharacteristic(index)
                                                }
                                                className="text-red-500 hover:text-red-700 font-bold text-lg px-2"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addCharacteristic}
                                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                >
                                    + Agregar característica
                                </button>
                                <InputError message={errors.characteristics} />
                            </div>

                            {/* PDF */}
                            <div className="md:col-span-2">
                                <InputLabel value="Reemplazar PDF" />
                                {project.pdf_path && (
                                    <p className="text-xs text-gray-500 mb-1">
                                        Ya tiene un PDF subido. Sube uno nuevo
                                        solo si quieres reemplazarlo.
                                    </p>
                                )}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700"
                                    onChange={(e) =>
                                        setData(
                                            "pdf",
                                            e.target.files[0] ?? null,
                                        )
                                    }
                                />
                                <InputError message={errors.pdf} />
                            </div>

                            {/* GALERÍA */}
                            <div className="md:col-span-2">
                                <InputLabel value="Agregar nuevas imágenes 360°" />
                                <p className="text-xs text-gray-500 mb-2">
                                    Las nuevas imágenes se agregan a las
                                    existentes.
                                </p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/webp"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700"
                                    onChange={handleGalleryChange}
                                />
                                <InputError
                                    message={errors.gallery_equirectangular}
                                />

                                {galleryPreviews.length > 0 && (
                                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                                        {galleryPreviews.map((preview, i) => (
                                            <div key={i} className="relative">
                                                <img
                                                    src={preview}
                                                    alt={`preview-${i}`}
                                                    className="w-full h-20 object-cover rounded-md border border-gray-200"
                                                />
                                                <p className="text-xs text-center text-gray-400 mt-1">
                                                    #{i + 1}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* SUBMIT */}
                            <div className="md:col-span-2 flex justify-end">
                                <PrimaryButton
                                    disabled={processing}
                                    type="submit"
                                    className="px-8"
                                >
                                    {processing
                                        ? "Actualizando..."
                                        : "Actualizar Proyecto"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
