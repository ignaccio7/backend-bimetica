// resources/js/Components/ui/Pagination.jsx
import { router } from "@inertiajs/react";

export default function Pagination({ currentPage, lastPage, routeName }) {
    // ✅ Cambié "route" por "routeName" para evitar confusión
    console.log({ currentPage, lastPage, routeName });

    // Si solo hay 1 página, no mostrar paginación
    if (lastPage <= 1) return null;

    const generatePageNumbers = () => {
        const pages = [];
        const delta = 1;

        pages.push(1);

        let start = Math.max(2, currentPage - delta);
        let end = Math.min(lastPage - 1, currentPage + delta);

        if (currentPage <= delta + 2) {
            end = Math.min(lastPage - 1, delta * 2 + 2);
        }

        if (currentPage >= lastPage - delta - 1) {
            start = Math.max(2, lastPage - delta * 2 - 1);
        }

        if (start > 2) {
            pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < lastPage - 1) {
            pages.push("...");
        }

        if (lastPage > 1) {
            pages.push(lastPage);
        }

        return pages;
    };

    const pages = generatePageNumbers();

    const onPageChange = (page) => {
        // ✅ FIX: Usar route() helper para generar la URL
        router.get(
            route(routeName), // ← Aquí estaba el problema
            { page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="w-full flex items-center justify-between gap-4 flex-wrap">
            <span className="text-sm text-gray-600">
                Página {currentPage} de {lastPage}
            </span>

            <div className="flex items-center gap-1 flex-wrap">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    ← Anterior
                </button>

                {pages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-1.5 text-gray-400"
                            >
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[36px] px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                currentPage === page
                                    ? "bg-primary-700 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        currentPage === lastPage
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    Siguiente →
                </button>
            </div>
        </div>
    );
}
