// import ApplicationLogo from '@/Components/ApplicationLogo';
// import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            <div className="mt-6 w-full overflow-hidden bg-white shadow-md sm:max-w-md md:max-w-2xl lg:max-w-3xl rounded-lg">
                {children}
            </div>
        </div>
    );
}
