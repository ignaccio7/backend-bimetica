import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function CreateUser({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        username: "",
        rol: "user",
        password: "",
        password_confirmation: "",
    });

    const submit = (event) => {
        event.preventDefault();
        console.log("Creando el usuario");
        console.log(data);

        post(
            route("user.store", {
                data: {
                    ...data,
                    rol: "user",
                },
            }),
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
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
                                <form onSubmit={submit}>
                                    <div>
                                        <InputLabel value="Nombre" />
                                        <TextInput
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div>
                                        <InputLabel value="Username" />
                                        <TextInput
                                            value={data.username}
                                            onChange={(e) =>
                                                setData(
                                                    "username",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.username} />
                                    </div>

                                    <div>
                                        <InputLabel value="Contraseña" />
                                        <TextInput
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <PrimaryButton
                                        disabled={processing}
                                        type="submit"
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
