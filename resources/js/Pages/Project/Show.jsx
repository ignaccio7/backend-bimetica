import { IconCalendar, IconClock, IconLocation, IconUser } from "@/Icons/icons";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Gallery from "./components/Gallery";
import Magazine from "./components/Magazine";

export default function Show({}) {
    return (
        <AuthenticatedLayout>
            <div className="py-6">
                <div className="actions mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="px-2 sm:px-0">
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
                            <article className="flex flex-col gap-4 md:gap-6">
                                <div className="tags flex flex-row gap-2 text-step-2 z-20">
                                    <span className="bg-secondary-500 text-white px-2 rounded-md">
                                        Salud
                                    </span>
                                    <span className="bg-primary-200 text-black px-2 rounded-md">
                                        En construcción
                                    </span>
                                </div>
                                <header className="">
                                    <h1 className="text-start text-step-6 font-black text-primary-500 leading-none text-balance">
                                        Torre Residencial Moderna
                                    </h1>
                                </header>
                                <p className="text-step-2">
                                    Este proyecto representa la culminación de
                                    años de investigación en diseño residencial
                                    sustentable. La Torre Residencial Moderna no
                                    es solo un edificio, sino un ecosistema
                                    vertical que redefine el concepto de vida
                                    urbana contemporánea.
                                </p>
                                <footer className="">
                                    <ul className="[&>li]:text-gray-700 text-step-2 grid grid-cols-2 gap-2">
                                        <li className="flex flex-row gap-1 items-center">
                                            <IconLocation size="16" />
                                            Ubicación: La Paz - Bolivia
                                        </li>
                                        <li className="flex flex-row gap-1 items-center">
                                            <IconCalendar size="16" />
                                            Año: 2025
                                        </li>
                                        <li className="flex flex-row gap-1 items-center">
                                            <IconClock size="16" />
                                            Duración: 12 meses
                                        </li>
                                        <li className="flex flex-row gap-1 items-center">
                                            <IconUser size="16" />
                                            Arquitecto: Juan Perez Ramirez
                                        </li>

                                        <li className="flex flex-row gap-1 items-center">
                                            <IconUser size="16" />
                                            Area: 5,000 m²
                                        </li>
                                    </ul>
                                </footer>
                            </article>
                            <picture className="place-self-center">
                                <img
                                    className="rounded-md"
                                    src="https://rc-propuesta-arquitectura.vercel.app/modern-residential-tower.png"
                                    alt="Imagen de prueba"
                                />
                            </picture>
                        </section>
                        <section className="gallery-equirectangular mt-10 mb-10">
                            <h2 className="text-center text-step-4 font-black text-primary-500 leading-none text-balance mb-6">
                                Galeria del proyecto
                            </h2>
                            <Gallery />
                        </section>
                        <section className="magazine mt-10 mb-50">
                            <h2 className="text-center text-step-4 font-black text-primary-500 leading-none text-balance mb-6">
                                Conozca más acerca de nuestro producto
                            </h2>
                            <div className="overflow-hidden">
                                <Magazine
                                    images={[
                                        "/projects-images/1.jpg",
                                        "/projects-images/2.jpg",
                                        "/projects-images/3.jpg",
                                        "/projects-images/4.jpg",
                                        "/projects-images/5.jpg",
                                        "/projects-images/6.jpg",
                                        "/projects-images/7.jpg",
                                    ]}
                                />
                            </div>
                        </section>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
