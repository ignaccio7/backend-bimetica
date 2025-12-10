import { useRef, forwardRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";

// Íconos SVG simples
const ZoomInIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

const ZoomOutIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
);

const MaximizeIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
);

const MinimizeIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
);

const ResetIcon = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
    >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
    </svg>
);

const Page = forwardRef(({ imgUrl }, ref) => (
    <div ref={ref} style={{ backgroundColor: "#fff" }}>
        <img
            src={imgUrl}
            alt="Magazine page"
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
            }}
            draggable={false}
        />
    </div>
));

Page.displayName = "Page";

export default function Magazine({ images = [] }) {
    const bookRef = useRef(null);
    const containerRef = useRef(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Asegurar número par de páginas
    const pages = [...images];
    if (pages.length % 2 !== 0) {
        pages.push(pages[pages.length - 1]);
    }

    const nextPage = () => {
        if (isFlipping) return;
        setIsFlipping(true);
        bookRef.current?.pageFlip()?.flipNext();
        setTimeout(() => setIsFlipping(false), 700);
    };

    const prevPage = () => {
        if (isFlipping) return;
        setIsFlipping(true);
        bookRef.current?.pageFlip()?.flipPrev();
        setTimeout(() => setIsFlipping(false), 700);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 1));
        if (zoom <= 1.25) {
            setPan({ x: 0, y: 0 });
        }
    };

    const handleReset = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - pan.x,
                y: e.clientY - pan.y,
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1) {
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleBookClick = (e) => {
        // Solo voltear página si el zoom es 1 (sin zoom)
        if (zoom > 1) {
            e.stopPropagation();
            return;
        }

        // Calcular posición del click relativa al libro
        const bookElement = e.currentTarget;
        const rect = bookElement.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const bookWidth = rect.width;

        // Definir zonas de "borde" (15% de cada lado)
        const edgeZone = bookWidth * 0.15;

        // Solo voltear si se hace click en los bordes
        if (clickX < edgeZone) {
            prevPage();
        } else if (clickX > bookWidth - edgeZone) {
            nextPage();
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
                padding: "2rem",
                backgroundColor: isFullscreen ? "#1e293b" : "transparent",
                minHeight: isFullscreen ? "100vh" : "auto",
                justifyContent: isFullscreen ? "center" : "flex-start",
            }}
        >
            {/* Controles superiores */}
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {/* Navegación */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={prevPage}
                        disabled={isFlipping}
                        style={{
                            padding: "0.75rem 1.5rem",
                            backgroundColor: isFlipping ? "#94a3b8" : "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "0.5rem",
                            cursor: isFlipping ? "not-allowed" : "pointer",
                            fontSize: "1rem",
                            fontWeight: "600",
                            opacity: isFlipping ? 0.6 : 1,
                        }}
                    >
                        ← Anterior
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={isFlipping}
                        style={{
                            padding: "0.75rem 1.5rem",
                            backgroundColor: isFlipping ? "#94a3b8" : "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "0.5rem",
                            cursor: isFlipping ? "not-allowed" : "pointer",
                            fontSize: "1rem",
                            fontWeight: "600",
                            opacity: isFlipping ? 0.6 : 1,
                        }}
                    >
                        Siguiente →
                    </button>
                </div>

                {/* Controles de zoom */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 1}
                        style={{
                            padding: "0.75rem",
                            backgroundColor: zoom <= 1 ? "#94a3b8" : "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "0.5rem",
                            cursor: zoom <= 1 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            opacity: zoom <= 1 ? 0.6 : 1,
                        }}
                    >
                        <ZoomOutIcon />
                        <span>Alejar</span>
                    </button>
                    <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 3}
                        style={{
                            padding: "0.75rem",
                            backgroundColor: zoom >= 3 ? "#94a3b8" : "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: "0.5rem",
                            cursor: zoom >= 3 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            opacity: zoom >= 3 ? 0.6 : 1,
                        }}
                    >
                        <ZoomInIcon />
                        <span>Acercar</span>
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={zoom === 1}
                        style={{
                            padding: "0.75rem",
                            backgroundColor: zoom === 1 ? "#94a3b8" : "#f59e0b",
                            color: "white",
                            border: "none",
                            borderRadius: "0.5rem",
                            cursor: zoom === 1 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            opacity: zoom === 1 ? 0.6 : 1,
                        }}
                    >
                        <ResetIcon />
                        <span>Reset</span>
                    </button>
                </div>

                {/* Pantalla completa */}
                <button
                    onClick={toggleFullscreen}
                    style={{
                        padding: "0.75rem",
                        backgroundColor: "#8b5cf6",
                        color: "white",
                        border: "none",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
                    <span>{isFullscreen ? "Salir" : "Pantalla Completa"}</span>
                </button>
            </div>

            {/* Indicador de zoom */}
            {zoom > 1 && (
                <div
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                    }}
                >
                    Zoom: {(zoom * 100).toFixed(0)}% •{" "}
                    {zoom > 1 ? "Arrastra para moverte" : ""}
                </div>
            )}

            {/* Flipbook con zoom y pan */}
            <div
                style={{
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                    overflow: zoom > 1 ? "hidden" : "visible",
                    cursor:
                        zoom > 1
                            ? isDragging
                                ? "grabbing"
                                : "grab"
                            : "default",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    onClick={handleBookClick}
                    style={{
                        transform: `scale(${zoom}) translate(${
                            pan.x / zoom
                        }px, ${pan.y / zoom}px)`,
                        transition: isDragging
                            ? "none"
                            : "transform 0.2s ease-out",
                        transformOrigin: "center center",
                    }}
                >
                    {/* Nota: HTMLFlipBook no está disponible en este entorno, 
                         pero en tu proyecto Laravel/React funcionará con esta estructura */}
                    <div
                        style={{
                            width: "450px",
                            height: "600px",
                            backgroundColor: "#e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: "2rem",
                            borderRadius: "0.5rem",
                        }}
                    >
                        <HTMLFlipBook
                            ref={bookRef}
                            width={450}
                            height={600}
                            size="fixed"
                            minWidth={315}
                            maxWidth={600}
                            minHeight={400}
                            maxHeight={800}
                            showCover={false}
                            flippingTime={500}
                            usePortrait={false}
                            startPage={0}
                            drawShadow={true}
                            useMouseEvents={zoom <= 1} // ⚠️ Importante
                            swipeDistance={30}
                            showPageCorners={true}
                            disableFlipByClick={true} // ⚠️ Importante
                            clickEventForward={true}
                            mobileScrollSupport={false}
                        >
                            {pages.map((img, index) => (
                                <Page key={index} imgUrl={img} />
                            ))}
                        </HTMLFlipBook>
                        {/* <div>
                            <h3
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "bold",
                                    marginBottom: "1rem",
                                }}
                            >
                                Simulación de Magazine
                            </h3>
                            <p
                                style={{
                                    color: "#64748b",
                                    marginBottom: "1rem",
                                }}
                            >
                                En tu proyecto, reemplaza este div con:
                            </p>
                            <code
                                style={{
                                    display: "block",
                                    backgroundColor: "#1e293b",
                                    color: "#10b981",
                                    padding: "1rem",
                                    borderRadius: "0.5rem",
                                    fontSize: "0.875rem",
                                    textAlign: "left",
                                }}
                            >
                                {`<HTMLFlipBook
  ref={bookRef}
  width={450}
  height={600}
  useMouseEvents={zoom <= 1}
  disableFlipByClick={true}
  ...otros props
>
  {pages.map((img, i) => (
    <Page key={i} imgUrl={img} />
  ))}
</HTMLFlipBook>`}
                            </code>
                        </div> */}
                    </div>
                </div>
            </div>

            <p
                style={{
                    color: isFullscreen ? "#94a3b8" : "#64748b",
                    fontSize: "0.875rem",
                    textAlign: "center",
                }}
            >
                {zoom > 1
                    ? "Arrastra para moverte • Haz click en los bordes para cambiar de página"
                    : "Haz clic en los bordes laterales para voltear páginas"}
            </p>
        </div>
    );
}
