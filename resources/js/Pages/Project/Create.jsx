import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

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

export default function CreateProject({ auth }) {
    // Características como lista de filas clave-valor
    const [characteristics, setCharacteristics] = useState([
        { key: "", value: "" },
    ]);

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        category: "",
        status: "En proceso",
        orientation: "vertical",
        characteristics: "",
        image: null,
        pdf: null,
        kuula_id: "",
    });

    /* ===============================
       CARACTERÍSTICAS
    =============================== */
    const addCharacteristic = () => {
        setCharacteristics([...characteristics, { key: "", value: "" }]);
    };

    const removeCharacteristic = (index) => {
        const updated = characteristics.filter((_, i) => i !== index);
        setCharacteristics(updated);
        syncCharacteristics(updated);
    };

    const updateCharacteristic = (index, field, value) => {
        const updated = characteristics.map((c, i) =>
            i === index ? { ...c, [field]: value } : c,
        );
        setCharacteristics(updated);
        syncCharacteristics(updated);
    };

    const syncCharacteristics = (rows) => {
        const obj = {};
        rows.forEach(({ key, value }) => {
            if (key.trim()) obj[key.trim()] = value;
        });
        setData("characteristics", JSON.stringify(obj));
    };

    /* ===============================
       SUBMIT
    =============================== */
    const submit = (e) => {
        e.preventDefault();
        post(route("project.store"), { forceFormData: true });
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
            <Head title="Crear Proyecto" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <form
                            onSubmit={submit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* ===== TÍTULO ===== */}
                            <div>
                                <InputLabel value="Título *" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    placeholder="Torre Residencial Moderna"
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* ===== CATEGORÍA ===== */}
                            <div>
                                <InputLabel value="Categoría" />
                                <select
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                                    {ESTADOS.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            {/* ===== ORIENTACIÓN PDF ===== */}
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
                                                checked={
                                                    data.orientation === ori
                                                }
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
                                <InputError message={errors.orientation} />
                            </div>

                            {/* ===== DESCRIPCIÓN ===== */}
                            <div className="md:col-span-2">
                                <InputLabel value="Descripción" />
                                <textarea
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    placeholder="Descripción del proyecto..."
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* ===== IMAGEN COVER ===== */}
                            <div className="md:col-span-2">
                                <InputLabel value="Imagen de portada" />
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) =>
                                        setData("image", e.target.files[0])
                                    }
                                />
                                <InputError message={errors.image} />
                            </div>

                            {/* ===== CARACTERÍSTICAS ===== */}
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
                            </div>

                            {/* ===== PDF ===== */}
                            <div className="md:col-span-2">
                                <InputLabel value="Archivo PDF (revista)" />
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) =>
                                        setData("pdf", e.target.files[0])
                                    }
                                />
                                <InputError message={errors.pdf} />
                            </div>

                            {/* ===== GALERÍA EQUIRECTANGULAR ===== */}
                            {/* ===== KUULA ID ===== */}
                            <div className="md:col-span-2">
                                <InputLabel value="ID de colección Kuula (Galería 360°)" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    placeholder="Ej: 5yXAN"
                                    value={data.kuula_id}
                                    onChange={(e) =>
                                        setData("kuula_id", e.target.value)
                                    }
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Código de la URL de Kuula:{" "}
                                    <code className="bg-gray-100 px-1 rounded">
                                        kuula.co/share/collection/
                                        <strong>5yXAN</strong>
                                    </code>
                                </p>
                                <InputError message={errors.kuula_id} />

                                {data.kuula_id && (
                                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-200">
                                        <iframe
                                            width="100%"
                                            height="380"
                                            frameBorder="0"
                                            allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
                                            allowFullScreen
                                            scrolling="no"
                                            src={`https://kuula.co/share/collection/${data.kuula_id}?logo=0&info=0&fs=1&vr=0&sd=1&thumbs=1`}
                                            style={{ display: "block" }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* ===== SUBMIT ===== */}
                            <div className="md:col-span-2 flex justify-end">
                                <PrimaryButton
                                    disabled={processing}
                                    type="submit"
                                    className="px-8"
                                >
                                    {processing
                                        ? "Guardando..."
                                        : "Crear Proyecto"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
