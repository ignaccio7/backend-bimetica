import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    IconBlocks,
    IconBuilding,
    IconHome,
    IconLibrary,
    IconTeam,
    IconUser,
} from "@/Icons/icons";
import { Head, Link, usePage } from "@inertiajs/react";

// ─── CardLink ────────────────────────────────────────────────────────────────
function CardLink({ label, description, icon: Icon, href }) {
    return (
        <Link
            href={href}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                padding: "1rem",
                border: "1px solid #e2e8f0",
                backgroundColor: "#fff",
                borderRadius: "0.75rem",
                textDecoration: "none",
                transition: "box-shadow 0.2s, border-color 0.2s",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "#c7d2fe";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e2e8f0";
            }}
        >
            <h3
                style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                {Icon && (
                    <span style={{ color: "#003e65", flexShrink: 0 }}>
                        <Icon />
                    </span>
                )}
                {label}
            </h3>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                {description}
            </p>
        </Link>
    );
}

// ─── Grupo de módulo ─────────────────────────────────────────────────────────
function ModuleGroup({ title, cards }) {
    return (
        <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
            <h2
                style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                }}
            >
                {title}
            </h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "0.875rem",
                }}
            >
                {cards.map((card) => (
                    <CardLink key={card.label} {...card} />
                ))}
            </div>
        </div>
    );
}

// ─── Módulos por rol ─────────────────────────────────────────────────────────
const MODULES_ADMIN = [
    {
        title: "Principal",
        cards: [
            {
                label: "Inicio",
                description: "Panel principal del sistema",
                icon: IconHome,
                href: route("dashboard"),
            },
            {
                label: "Perfil",
                description: "Gestiona tu información personal",
                icon: IconUser,
                href: route("profile.edit"),
            },
        ],
    },
    {
        title: "Usuarios",
        cards: [
            {
                label: "Gestionar usuarios",
                description:
                    "Crea, edita y administra los usuarios del sistema",
                icon: IconTeam,
                href: route("user.index"),
            },
        ],
    },
    {
        title: "Servicios",
        cards: [
            {
                label: "Gestionar servicios",
                description: "Administra los servicios disponibles",
                icon: IconHome,
                href: route("service.index"),
            },
            {
                label: "Nuestros recursos",
                description: "Visualiza los recursos agrupados por servicio",
                icon: IconLibrary,
                href: route("resource.viewer"),
            },
        ],
    },
    {
        title: "Recursos",
        cards: [
            {
                label: "Gestionar PDFs",
                description: "Sube y administra los recursos en PDF",
                icon: IconBuilding,
                href: route("resource.index"),
            },
            {
                label: "Gestionar galerías",
                description: "Administra las galerías 360° por servicio",
                icon: IconBuilding,
                href: route("resource-gallery.index"),
            },
        ],
    },
    // {
    //     title: "Proyectos públicos",
    //     cards: [
    //         {
    //             label: "Gestionar proyectos públicos",
    //             description: "Administra los proyectos visibles al público",
    //             icon: IconBuilding,
    //             href: route("public-project.index"),
    //         },
    //     ],
    // },
    {
        title: "Proyectos",
        cards: [
            {
                label: "Gestionar proyectos",
                description: "Administra todos los proyectos internos",
                icon: IconBlocks,
                href: route("project.list"),
            },
            {
                label: "Nuestros proyectos",
                description: "Visualiza el portafolio de proyectos",
                icon: IconBuilding,
                href: route("project.index"),
            },
        ],
    },
];

const MODULES_USER = [
    {
        title: "Principal",
        cards: [
            {
                label: "Inicio",
                description: "Panel principal del sistema",
                icon: IconHome,
                href: route("dashboard"),
            },
            {
                label: "Perfil",
                description: "Gestiona tu información personal",
                icon: IconUser,
                href: route("profile.edit"),
            },
        ],
    },
    {
        title: "Servicios",
        cards: [
            {
                label: "Nuestros recursos",
                description: "Accede a los recursos disponibles por servicio",
                icon: IconLibrary,
                href: route("resource.viewer"),
            },
        ],
    },
    {
        title: "Proyectos",
        cards: [
            {
                label: "Nuestros proyectos",
                description: "Visualiza el portafolio de proyectos",
                icon: IconBuilding,
                href: route("project.index"),
            },
        ],
    },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const user = usePage().props.auth.user;
    const rol = user.role || "user";
    const modules = rol === "admin" ? MODULES_ADMIN : MODULES_USER;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Bienvenid@,{" "}
                    <span style={{ color: "#003e65" }}>
                        {user.name || user.username}
                    </span>{" "}
                    <br />
                    <small className="text-gray-500 text-sm font-normal">
                        Tienes acceso a los siguientes módulos
                    </small>
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2rem",
                            padding: "0 0.5rem",
                        }}
                    >
                        {modules.map((mod) => (
                            <ModuleGroup
                                key={mod.title}
                                title={mod.title}
                                cards={mod.cards}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
