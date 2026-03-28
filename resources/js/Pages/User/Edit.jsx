import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function EditUser({ user }) {
    // console.log(user);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        username: user.username,
        rol: user.role,
    });

    const submit = (event) => {
        event.preventDefault();
        // console.log("Creando el usuario");
        // console.log(data);

        put(
            route("user.update", {
                user: user.id,
            }),
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Crear usuario
                </h2>
            }
        >
            <div className="py-0">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-0">
                    <Head title="Crear usuario" />

                    <div className="py-6">
                        <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                                <form
                                    onSubmit={submit}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div>
                                        <InputLabel value="Nombre" />
                                        <TextInput
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder={"Alonzo ugarte"}
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div>
                                        <InputLabel value="Username" />
                                        <TextInput
                                            value={data.username}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "username",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={"alonuga"}
                                        />
                                        <InputError message={errors.username} />
                                    </div>

                                    <div className="col-span-1">
                                        <InputLabel htmlFor="rol" value="Rol" />
                                        <select
                                            name="rol"
                                            id="rol"
                                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            onChange={(e) =>
                                                setData("rol", e.target.value)
                                            }
                                        >
                                            <option value="user">
                                                Usuario
                                            </option>
                                            <option value="admin">
                                                Administrador
                                            </option>
                                        </select>
                                    </div>

                                    <PrimaryButton
                                        disabled={processing}
                                        type="submit"
                                        className="w-fit px-6 col-span-1 md:col-span-2"
                                    >
                                        Crear usuario
                                    </PrimaryButton>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
