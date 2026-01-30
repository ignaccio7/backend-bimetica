import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import { Transition } from "@headlessui/react";
import { useState } from "react";

export default function Create({ className = "" }) {
    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
            title: "",
            description: "",
            type: "",
            items: [],
            benefits: [],
            image: null,
        });

    console.log(errors);

    const [preview, setPreview] = useState(null);

    // Funciones para manejar ITEMS (con título y categorías anidadas)
    const handleAddItem = () => {
        setData("items", [...data.items, { title: "", categories: [] }]);
    };

    const handleChangeItemTitle = (index, value) => {
        const updated = [...data.items];
        updated[index].title = value;
        setData("items", updated);
    };

    const handleRemoveItem = (index) => {
        const updated = [...data.items];
        updated.splice(index, 1);
        setData("items", updated);
    };

    // Funciones para manejar CATEGORÍAS dentro de cada ITEM
    const handleAddCategory = (itemIndex) => {
        const updated = [...data.items];
        updated[itemIndex].categories.push("");
        setData("items", updated);
    };

    const handleChangeCategory = (itemIndex, categoryIndex, value) => {
        const updated = [...data.items];
        updated[itemIndex].categories[categoryIndex] = value;
        setData("items", updated);
    };

    const handleRemoveCategory = (itemIndex, categoryIndex) => {
        const updated = [...data.items];
        updated[itemIndex].categories.splice(categoryIndex, 1);
        setData("items", updated);
    };

    // Funciones para manejar BENEFITS (sin cambios)
    const handleAddBenefit = () => {
        setData("benefits", [...data.benefits, ""]);
    };

    const handleChangeBenefit = (index, value) => {
        const updated = [...data.benefits];
        updated[index] = value;
        setData("benefits", updated);
    };

    const handleRemoveBenefit = (index) => {
        const updated = [...data.benefits];
        updated.splice(index, 1);
        setData("benefits", updated);
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setData("image", file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("service.store"), {
            forceFormData: true,
            onSuccess: () => {
                console.log("Servicio creado");
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Servicios - Bimetica" />
            <div className="py-6">
                <div className="actions mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <h1 className="text-xl font-semibold leading-tight text-gray-800">
                        Crear nuevo servicio
                    </h1>
                    <form
                        onSubmit={submit}
                        className="mt-6 border border-gray-200 p-6 rounded-xl shadow-sm space-y-6 bg-white"
                    >
                        {/* TITLE */}
                        <div>
                            <InputLabel
                                htmlFor="title"
                                value="Título del servicio"
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

                        {/* DESCRIPTION */}
                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="Descripción"
                            />
                            <textarea
                                id="description"
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                rows="4"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />
                            <InputError
                                className="mt-2"
                                message={errors.description}
                            />
                        </div>

                        {/* TYPE */}
                        <div>
                            <InputLabel htmlFor="type" value="Tipo" />
                            <select
                                id="type"
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                            >
                                <option value="">Seleccione...</option>
                                <option value="diseño">Diseño</option>
                                <option value="construccion">
                                    Construcción
                                </option>
                            </select>
                            <InputError
                                className="mt-2"
                                message={errors.type}
                            />
                        </div>

                        {/* ITEMS (Títulos con categorías anidadas) */}
                        <div>
                            <InputLabel value="Items del servicio" />
                            <p className="text-sm text-gray-600 mt-1 mb-3">
                                Cada item tiene un título y sus propias
                                categorías
                            </p>

                            {data.items.map((item, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50"
                                >
                                    {/* Título del Item */}
                                    <div className="flex items-start gap-2 mb-3">
                                        <div className="flex-1">
                                            <InputLabel
                                                value={`Título del item ${
                                                    itemIndex + 1
                                                }`}
                                            />
                                            <TextInput
                                                className="w-full mt-1"
                                                placeholder="Ej: PLANOS ARQUITECTÓNICOS"
                                                value={item.title}
                                                onChange={(e) =>
                                                    handleChangeItemTitle(
                                                        itemIndex,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <InputError
                                                className="mt-1"
                                                message={
                                                    errors[
                                                        `items.${itemIndex}.title`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveItem(itemIndex)
                                            }
                                            className="bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 mt-6"
                                        >
                                            Eliminar Item
                                        </button>
                                    </div>

                                    {/* Categorías del Item */}
                                    <div className="ml-4">
                                        <InputLabel
                                            value="Categorías"
                                            className="text-sm"
                                        />

                                        {item.categories.map(
                                            (category, categoryIndex) => (
                                                <div
                                                    key={categoryIndex}
                                                    className="flex items-start gap-2 mt-2"
                                                >
                                                    <TextInput
                                                        className="flex-1"
                                                        placeholder="Nombre de la categoría"
                                                        value={category}
                                                        onChange={(e) =>
                                                            handleChangeCategory(
                                                                itemIndex,
                                                                categoryIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveCategory(
                                                                itemIndex,
                                                                categoryIndex
                                                            )
                                                        }
                                                        className="bg-red-400 text-white px-3 py-2 rounded-md text-sm hover:bg-red-500"
                                                    >
                                                        X
                                                    </button>
                                                    <InputError
                                                        className="mt-1"
                                                        message={
                                                            errors[
                                                                `items.${itemIndex}.categories.${categoryIndex}`
                                                            ]
                                                        }
                                                    />
                                                </div>
                                            )
                                        )}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAddCategory(itemIndex)
                                            }
                                            className="mt-2 text-indigo-600 hover:underline text-sm"
                                        >
                                            + Añadir categoría
                                        </button>

                                        <InputError
                                            className="mt-1"
                                            message={
                                                errors[
                                                    `items.${itemIndex}.categories`
                                                ]
                                            }
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-600"
                            >
                                + Añadir nuevo item
                            </button>

                            <InputError
                                className="mt-2"
                                message={errors.items}
                            />
                        </div>

                        {/* BENEFITS */}
                        <div>
                            <InputLabel value="Beneficios" />

                            {data.benefits.map((ben, index) => (
                                <div key={index} className="flex flex-col mt-2">
                                    <div className="flex">
                                        <TextInput
                                            className="flex-1"
                                            value={ben}
                                            onChange={(e) =>
                                                handleChangeBenefit(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveBenefit(index)
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                                        >
                                            X
                                        </button>
                                    </div>
                                    <InputError
                                        className="mt-2"
                                        message={errors[`benefits.${index}`]}
                                    />
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddBenefit}
                                className="mt-2 text-indigo-600 hover:underline text-sm"
                            >
                                + Añadir beneficio
                            </button>

                            <InputError
                                className="mt-2"
                                message={errors.benefits}
                            />
                        </div>

                        {/* IMAGE */}
                        <div>
                            <InputLabel htmlFor="image" value="Imagen" />

                            <div
                                className={`
                                    mt-2 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition
                                    ${
                                        preview
                                            ? "border-indigo-500 bg-indigo-50"
                                            : "border-gray-300 hover:border-indigo-400"
                                    }
                                `}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (
                                        file &&
                                        file.type.startsWith("image/")
                                    ) {
                                        setData("image", file);
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                                onClick={() =>
                                    document
                                        .getElementById("dropzoneFile")
                                        .click()
                                }
                            >
                                <input
                                    id="dropzoneFile"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setData("image", file);
                                        if (file)
                                            setPreview(
                                                URL.createObjectURL(file)
                                            );
                                    }}
                                />

                                {!preview ? (
                                    <p className="text-gray-500">
                                        Arrastra una imagen aquí o{" "}
                                        <span className="text-indigo-600 underline">
                                            haz clic para subir
                                        </span>
                                    </p>
                                ) : (
                                    <img
                                        src={preview}
                                        className="mx-auto w-40 h-40 object-cover rounded-lg shadow"
                                    />
                                )}
                            </div>

                            <InputError
                                className="mt-2"
                                message={errors.image}
                            />
                        </div>

                        {/* SUBMIT */}
                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing} type="submit">
                                Registrar servicio
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
