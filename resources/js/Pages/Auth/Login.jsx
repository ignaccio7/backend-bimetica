// import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { IconUser } from "@/Icons/icons";
import GuestLayout from "@/Layouts/GuestLayout";
import {
    Head,
    // Link,
    useForm,
} from "@inertiajs/react";

export default function Login({
    status,
    landingUrl = "",
    // canResetPassword
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="min-h-screen w-full bg-[#0f172a] absolute top-0 left-0 -z-10">
                {/* Blue Radial Glow Background */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)`,
                    }}
                />
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="login flex flex-col gap-4 py-8">
                <IconUser
                    size="64"
                    className="mx-auto bg-primary-500 text-white rounded-full p-3"
                />
                <h1 className="text-center text-step-4 font-bold text-primary-500">
                    Iniciar sesión
                </h1>
                <div>
                    {/* <InputLabel
                        htmlFor="username"
                        value="Introduzca su usuario"
                    /> */}

                    <TextInput
                        // id="email"
                        // type="email"
                        placeholder="Introduzca su usuario"
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="block w-full bg-gray-100"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("username", e.target.value)}
                    />

                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-0">
                    {/* <InputLabel htmlFor="password" value="Password" /> */}

                    <TextInput
                        placeholder="Introduzca su contraseña"
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-gray-100"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div> */}

                <div className="mt-2 flex flex-col items-center justify-between gap-2">
                    {/* {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )} */}

                    <PrimaryButton
                        className="w-full text-center flex justify-center"
                        disabled={processing}
                        type="submit"
                    >
                        Inicia sesión
                    </PrimaryButton>
                    <a
                        href={landingUrl}
                        className="text-secondary-500 px-4 py-2 rounded-md text-step-1 font-semibold text-white uppercase"
                        type="button"
                    >
                        Volver a la página
                    </a>
                </div>
            </form>
        </GuestLayout>
    );
}
