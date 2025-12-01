import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                "inline-flex items-center gap-2 px-2 py-1 font-medium leading-5 transition duration-150 ease-in-out focus:outline-none text-step-2 text-white " +
                (active
                    ? "bg-secondary-300 text-primary-500 rounded-md text-step-2"
                    : "text-step-2 hover:bg-secondary-300 hover:text-primary-500 rounded-md") +
                className
            }
        >
            {children}
        </Link>
    );
}
