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
                "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? "border-secondary-400 text-secondary-500"
                    : "border-transparent text-step-2 text-white hover:border-gray-300 hover:text-secondary-500 focus:border-secondary-300 ") +
                className
            }
        >
            {children}
        </Link>
    );
}
