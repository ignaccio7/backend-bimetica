import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfToImages({ pdfUrl, onLoad }) {
    const [status, setStatus] = useState("idle"); // "idle" | "loading" | "done" | "error"
    const [progress, setProgress] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!pdfUrl) return;

        const loadPdf = async () => {
            try {
                setStatus("loading");
                setProgress(0);

                const pdf = await getDocument(pdfUrl).promise;
                const total = pdf.numPages;
                setTotalPages(total);
                const images = [];

                for (let i = 1; i <= total; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2 });
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: context, viewport })
                        .promise;
                    images.push(canvas.toDataURL("image/jpeg"));
                    setProgress(Math.round((i / total) * 100));
                }

                onLoad(images);
                setStatus("done");
            } catch (error) {
                console.error("Error cargando PDF:", error);
                setStatus("error");
            }
        };

        loadPdf();
    }, [pdfUrl]);

    if (status === "idle" || status === "done") return null;

    if (status === "error") {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "420px",
                    fontSize: "0.8rem",
                    color: "#ef4444",
                    gap: "0.4rem",
                }}
            >
                <span>✕</span> Error al cargar el PDF
            </div>
        );
    }

    // ── Loader animado ──────────────────────────────────────────
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "420px", // ← misma altura que el Magazine mínimo
                gap: "1.25rem",
                backgroundColor: "#f8fafc",
                borderRadius: "0.5rem",
            }}
        >
            {/* Ícono de páginas animado */}
            <div
                style={{ position: "relative", width: "48px", height: "56px" }}
            >
                {[2, 1, 0].map((layer) => (
                    <div
                        key={layer}
                        style={{
                            position: "absolute",
                            width: "36px",
                            height: "46px",
                            backgroundColor:
                                layer === 0
                                    ? "#fff"
                                    : layer === 1
                                      ? "#e2e8f0"
                                      : "#cbd5e1",
                            border: "1.5px solid #cbd5e1",
                            borderRadius: "3px",
                            top: `${layer * 4}px`,
                            left: `${layer * 4}px`,
                            animation:
                                layer === 0
                                    ? "pagePulse 1.6s ease-in-out infinite"
                                    : "none",
                            animationDelay: "0.2s",
                        }}
                    />
                ))}
                <style>{`
                    @keyframes pagePulse {
                        0%, 100% { transform: translateY(0); opacity: 1; }
                        50%       { transform: translateY(-4px); opacity: 0.7; }
                    }
                `}</style>
            </div>

            {/* Texto */}
            <div style={{ textAlign: "center" }}>
                <p
                    style={{
                        margin: "0 0 0.5rem",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        color: "#475569",
                    }}
                >
                    Preparando revista
                </p>
                {totalPages > 0 && (
                    <p
                        style={{
                            margin: 0,
                            fontSize: "0.7rem",
                            color: "#94a3b8",
                        }}
                    >
                        Página {Math.round((progress / 100) * totalPages)} de{" "}
                        {totalPages}
                    </p>
                )}
            </div>

            {/* Barra de progreso */}
            <div
                style={{
                    width: "160px",
                    height: "4px",
                    backgroundColor: "#e2e8f0",
                    borderRadius: "9999px",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${progress}%`,
                        backgroundColor: "#9AC72D",
                        borderRadius: "9999px",
                        transition: "width 0.3s ease",
                    }}
                />
            </div>

            <span
                style={{
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    color: "#9AC72D",
                }}
            >
                {progress}%
            </span>
        </div>
    );
}
