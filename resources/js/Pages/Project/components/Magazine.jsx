import { useRef, forwardRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

const IconMaximize = () => <span>⊡</span>;
const IconMinimize = () => <span>⊟</span>;
const IconReset = () => <span>↻</span>;
const IconZoomIn = () => <span>🔍+</span>;
const IconZoomOut = () => <span>🔍-</span>;

const Page = forwardRef(({ imgUrl }, ref) => (
    <div
        ref={ref}
        style={{
            backgroundColor: "#fff",
            width: "100%",
            height: "100%",
            overflow: "hidden",
        }}
    >
        <img
            src={imgUrl}
            alt="Magazine page"
            style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", // "contain" para no cortar nada
            }}
            draggable={false}
        />
    </div>
));

Page.displayName = "Page";

function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) setMatches(media.matches);
        const listener = () => setMatches(media.matches);
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
}

// orientation: "vertical" | "horizontal"
export default function Magazine({ images = [], orientation = "vertical" }) {
    const bookRef = useRef(null);
    const containerRef = useRef(null);
    const bookWrapperRef = useRef(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [containerSize, setContainerSize] = useState({
        width: 900,
        height: 600,
    });
    const [currentPage, setCurrentPage] = useState(0);

    const isMobile = useMediaQuery("(max-width: 767px)");
    const isHorizontal = orientation === "horizontal";

    const pages = [...images];
    if (pages.length % 2 !== 0) {
        pages.push(pages[pages.length - 1]);
    }

    useEffect(() => {
        const updateSize = () => {
            if (bookWrapperRef.current) {
                const wrapper = bookWrapperRef.current;
                const width = wrapper.clientWidth;

                let height;
                if (isMobile) {
                    // En móvil siempre una página, ajustar según orientación
                    height = isHorizontal ? width * 0.7 : width * 1.41;
                } else {
                    // En desktop: el libro tiene 2 páginas de ancho
                    // Para horizontal: cada página es landscape (ancho > alto)
                    // Para vertical: cada página es portrait (alto > ancho)
                    height = isHorizontal
                        ? (width / 2) * 0.7
                        : (width / 2) * 1.41;
                }

                setContainerSize({ width, height });
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [isFullscreen, isMobile, isHorizontal]);

    const nextPage = () => {
        if (isFlipping || zoom > 1) return;
        setIsFlipping(true);
        try {
            bookRef.current?.pageFlip()?.flipNext();
        } catch (e) {
            console.error(e);
        }
        setTimeout(() => setIsFlipping(false), 700);
    };

    const prevPage = () => {
        if (isFlipping || zoom > 1) return;
        setIsFlipping(true);
        try {
            bookRef.current?.pageFlip()?.flipPrev();
        } catch (e) {
            console.error(e);
        }
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

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 1));
        if (zoom <= 1.25) setPan({ x: 0, y: 0 });
    };
    const handleReset = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (zoom > 1) {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
            setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1) {
            e.preventDefault();
            e.stopPropagation();
            setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        }
    };

    const handleMouseUp = (e) => {
        if (zoom > 1) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsDragging(false);
    };

    const handleBookClick = (e) => {
        if (zoom > 1) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        const bookElement = bookWrapperRef.current;
        if (!bookElement) return;
        const rect = bookElement.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const bookWidth = rect.width;
        const edgeZone = bookWidth * 0.15;
        if (clickX < edgeZone) prevPage();
        else if (clickX > bookWidth - edgeZone) nextPage();
    };

    // En horizontal el libro es más ancho que alto, cada página ocupa width/2
    const pageWidth = isMobile ? containerSize.width : containerSize.width / 2;

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
                padding: isMobile ? "1rem" : "2rem",
                backgroundColor: isFullscreen ? "#1e293b" : "transparent",
                minHeight: isFullscreen ? "100vh" : "auto",
                justifyContent: isFullscreen ? "center" : "flex-start",
                width: "100%",
            }}
        >
            {/* Controles */}
            <div
                style={{
                    display: "flex",
                    gap: isMobile ? "0.5rem" : "1rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={prevPage}
                        disabled={isFlipping || zoom > 1}
                        style={btnStyle(
                            isFlipping || zoom > 1,
                            "#3b82f6",
                            isMobile,
                        )}
                    >
                        ← {isMobile ? "Ant" : "Anterior"}
                    </button>
                    <button
                        onClick={nextPage}
                        disabled={isFlipping || zoom > 1}
                        style={btnStyle(
                            isFlipping || zoom > 1,
                            "#3b82f6",
                            isMobile,
                        )}
                    >
                        {isMobile ? "Sig" : "Siguiente"} →
                    </button>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 1}
                        style={iconBtnStyle(zoom <= 1, "#10b981", isMobile)}
                    >
                        <IconZoomOut />
                        {!isMobile && <span>Alejar</span>}
                    </button>
                    <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 3}
                        style={iconBtnStyle(zoom >= 3, "#10b981", isMobile)}
                    >
                        <IconZoomIn />
                        {!isMobile && <span>Acercar</span>}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={zoom === 1}
                        style={iconBtnStyle(zoom === 1, "#f59e0b", isMobile)}
                    >
                        <IconReset />
                        {!isMobile && <span>Reset</span>}
                    </button>
                </div>

                {!isMobile && (
                    <button
                        onClick={toggleFullscreen}
                        style={iconBtnStyle(false, "#8b5cf6", isMobile)}
                    >
                        {isFullscreen ? <IconMinimize /> : <IconMaximize />}
                        <span>
                            {isFullscreen ? "Salir" : "Pantalla Completa"}
                        </span>
                    </button>
                )}
            </div>

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
                    Zoom: {(zoom * 100).toFixed(0)}% • Arrastra para moverte
                </div>
            )}

            {isMobile && (
                <div
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#8b5cf6",
                        color: "white",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                    }}
                >
                    📱 Modo Móvil - Vista de 1 página
                </div>
            )}

            {/* Contenedor del libro */}
            <div
                style={{
                    width: "100%",
                    maxWidth: isMobile ? "100%" : "1200px",
                    overflow: zoom > 1 ? "hidden" : "visible",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                    borderRadius: "0.5rem",
                    position: "relative",
                }}
            >
                <div
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleBookClick}
                    onTouchStart={(e) => {
                        if (zoom > 1) {
                            const touch = e.touches[0];
                            setIsDragging(true);
                            setDragStart({
                                x: touch.clientX - pan.x,
                                y: touch.clientY - pan.y,
                            });
                        }
                    }}
                    onTouchMove={(e) => {
                        if (isDragging && zoom > 1) {
                            e.preventDefault();
                            const touch = e.touches[0];
                            setPan({
                                x: touch.clientX - dragStart.x,
                                y: touch.clientY - dragStart.y,
                            });
                        }
                    }}
                    onTouchEnd={handleMouseUp}
                    style={{
                        cursor:
                            zoom > 1
                                ? isDragging
                                    ? "grabbing"
                                    : "grab"
                                : "default",
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transition: isDragging
                            ? "none"
                            : "transform 0.2s ease-out",
                        transformOrigin: "center center",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <div
                        ref={bookWrapperRef}
                        style={{
                            width: "100%",
                            height: `${containerSize.height}px`,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                        }}
                    >
                        {/* Bloquea drag interno del flipbook cuando hay zoom */}
                        {zoom > 1 && (
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    zIndex: 10,
                                    cursor: isDragging ? "grabbing" : "grab",
                                }}
                            />
                        )}
                        <HTMLFlipBook
                            ref={bookRef}
                            key={`${containerSize.width}-${containerSize.height}-${isMobile}-${orientation}`}
                            width={pageWidth}
                            height={containerSize.height}
                            size="stretch"
                            usePortrait={isMobile}
                            minWidth={200}
                            maxWidth={1400}
                            minHeight={200}
                            maxHeight={1400}
                            showCover={false}
                            flippingTime={300}
                            startPage={currentPage}
                            drawShadow={true}
                            useMouseEvents={zoom <= 1}
                            swipeDistance={30}
                            showPageCorners={false}
                            disableFlipByClick={true}
                            clickEventForward={false}
                            mobileScrollSupport={false}
                            onFlip={(e) => setCurrentPage(e.data)}
                            style={{
                                minHeight: 0,
                                height: containerSize.height,
                            }}
                        >
                            {pages.map((img, index) => (
                                <Page key={index} imgUrl={img} />
                            ))}
                        </HTMLFlipBook>
                    </div>
                </div>
            </div>

            <p
                style={{
                    color: isFullscreen ? "#94a3b8" : "#64748b",
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                    textAlign: "center",
                    padding: "0 1rem",
                }}
            >
                {zoom > 1
                    ? "Arrastra para moverte • Los botones de navegación están deshabilitados con zoom"
                    : isMobile
                      ? "Desliza o usa los botones para cambiar de página"
                      : "Haz clic en los bordes laterales para voltear páginas"}
            </p>
        </div>
    );
}

// Helpers de estilos
function btnStyle(disabled, color, isMobile) {
    return {
        padding: isMobile ? "0.5rem 1rem" : "0.75rem 1.5rem",
        backgroundColor: disabled ? "#94a3b8" : color,
        color: "white",
        border: "none",
        borderRadius: "0.5rem",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: isMobile ? "0.875rem" : "1rem",
        fontWeight: "600",
        opacity: disabled ? 0.6 : 1,
    };
}

function iconBtnStyle(disabled, color, isMobile) {
    return {
        padding: isMobile ? "0.5rem" : "0.75rem",
        backgroundColor: disabled ? "#94a3b8" : color,
        color: "white",
        border: "none",
        borderRadius: "0.5rem",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        opacity: disabled ? 0.6 : 1,
        fontSize: isMobile ? "0.875rem" : "1rem",
    };
}
