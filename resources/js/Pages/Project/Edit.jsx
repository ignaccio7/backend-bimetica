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
    // console.log(project);

    /* ===============================
       ESTADOS
    =============================== */
    const [characteristics, setCharacteristics] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    /* ===============================
       FORM
    =============================== */
    const { data, setData, put, processing, errors } = useForm({
        title: project.title || "",
        description: project.description || "",
        category: project.category || "",
        status: project.status || "En proceso",
        orientation: project.orientation || "vertical",
        image: project.image_path || null,
        characteristics: "",
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

        if (project.gallery_equirectangular) {
            setGalleryPreviews(
                project.gallery_equirectangular.map((img) => `/storage/${img}`),
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
    };

    /* ===============================
       GALERÍA NUEVA
    =============================== */
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setData("gallery_equirectangular", files);

        const previews = files.map((f) => URL.createObjectURL(f));
        setGalleryPreviews(previews);
    };

    /* ===============================
       SUBMIT
    =============================== */
    const submit = (e) => {
        console.log(project);

        e.preventDefault();
        put(
            route("project.update", {
                project: project.slug,
            }),
            {
                forceFormData: true,
            },
        );
    };

    // Reemplaza el useEffect de galería:
    useEffect(() => {
        if (project.characteristics) {
            const rows = Object.entries(project.characteristics).map(
                ([key, value]) => ({ key, value }),
            );
            setCharacteristics(rows);
            setData("characteristics", JSON.stringify(project.characteristics));
        }

        // ✅ Galería desde rutas privadas del controlador
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
                            </div>

                            {/* ORIENTACIÓN */}
                            <div>
                                <InputLabel value="Orientación PDF" />
                                <div className="flex gap-6 mt-2">
                                    {["vertical", "horizontal"].map((ori) => (
                                        <label key={ori} className="flex gap-2">
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
                                            {ori}
                                        </label>
                                    ))}
                                </div>
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
                            </div>

                            {/* IMAGEN COVER ACTUAL */}
                            <div className="md:col-span-2">
                                <InputLabel value="Imagen de portada" />

                                {project.image_path && (
                                    <div className="mb-3">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Imagen actual:
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
                                        setData("image", e.target.files[0])
                                    }
                                />
                                <InputError message={errors.image} />
                            </div>

                            {/* CARACTERÍSTICAS */}
                            <div className="md:col-span-2">
                                <InputLabel value="Características" />
                                {characteristics.map((char, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 mb-2"
                                    >
                                        <TextInput
                                            className="w-1/3"
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
                                            className="text-red-500"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addCharacteristic}
                                    className="text-indigo-600 text-sm"
                                >
                                    + Agregar característica
                                </button>
                            </div>

                            {/* PDF */}
                            <div className="md:col-span-2">
                                <InputLabel value="Reemplazar PDF" />
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) =>
                                        setData("pdf", e.target.files[0])
                                    }
                                />
                            </div>

                            {/* GALERÍA */}
                            <div className="md:col-span-2">
                                <InputLabel value="Agregar nuevas imágenes 360°" />
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleGalleryChange}
                                />

                                {galleryPreviews.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                        {galleryPreviews.map((preview, i) => (
                                            <img
                                                key={i}
                                                src={preview}
                                                className="h-20 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="md:col-span-2 flex justify-end">
                                <PrimaryButton
                                    disabled={processing}
                                    type="submit"
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
