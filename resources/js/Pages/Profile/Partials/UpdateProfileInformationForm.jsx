import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";

export default function UpdateProfileInformation({
    // mustVerifyEmail,
    // status,
    className = "",
}) {
    const user = usePage().props.auth.user;
    console.log(user);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            username: user.username,
        });

    const submit = (e) => {
        e.preventDefault();
        console.log("Actualizando");
        console.log("Datos a enviar:", data);

        patch(route("profile.update"), {
            preserveScroll: true,
            onSuccess: () => {
                console.log("Perfil actualizado exitosamente");
            },
            onError: (errors) => {
                console.log("Errores:", errors);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Información del perfil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Puedes editar tus datos de perfil
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>
                <div className="flex items-center gap-4">
                    <PrimaryButton type="submit" disabled={processing}>
                        Guardar
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Guardado.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
