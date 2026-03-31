import { useRef, forwardRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import {
    IconMaximize,
    IconMinimize,
    IconReset,
    IconZoomIn,
    IconZoomOut,
    IconChevronLeft,
    IconChevronRight,
} from "@/Icons/icons";

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
                objectFit: "contain",
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

export default function Magazine({ images = [], orientation = "vertical" }) {
    const bookRef = useRef(null);
    const containerRef = useRef(null);
    const bookWrapperRef = useRef(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fsHeight, setFsHeight] = useState(window.innerHeight);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [containerSize, setContainerSize] = useState({
        width: 900,
        height: 600,
    });
    const currentPageRef = useRef(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [isAnimatingPrev, setIsAnimatingPrev] = useState(false);
    const isPrevTurnRef = useRef(false);

    const isMobile = useMediaQuery("(max-width: 767px)");
    const isHorizontal = orientation === "horizontal";

    const pages = [...images];
    if (pages.length % 2 !== 0) {
        pages.push(pages[pages.length - 1]);
    }

    // Sincronizar con Escape y resetear zoom/pan al cambiar modo
    useEffect(() => {
        const handleFsChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
                setZoom(1);
                setPan({ x: 0, y: 0 });
            } else {
                setFsHeight(window.innerHeight);
            }
        };
        document.addEventListener("fullscreenchange", handleFsChange);
        return () =>
            document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    // Actualizar fsHeight al rotar pantalla en mobile
    useEffect(() => {
        const handleResize = () => {
            if (isFullscreen) setFsHeight(window.innerHeight);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isFullscreen]);

    // Calcular tamaño del contenedor
    useEffect(() => {
        const updateSize = () => {
            if (bookWrapperRef.current) {
                const wrapper = bookWrapperRef.current;
                const width = wrapper.clientWidth;

                let height;
                if (isMobile) {
                    height = isHorizontal ? width * 0.7 : width * 1.41;
                } else {
                    height = isHorizontal
                        ? (width / 2) * 0.7
                        : (width / 2) * 1.41;
                }

                const MIN_HEIGHT = isHorizontal ? 300 : 400;
                height = Math.max(height, MIN_HEIGHT);

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
            const pf = bookRef.current?.pageFlip();
            pf?.flipNext();
        } catch (e) {
            console.error(e);
        }
        setIsFlipping(false);
    };

    const prevPage = () => {
        if (isFlipping || zoom > 1) return;
        if (currentPageRef.current <= 0) return;
        setIsFlipping(true);

        if (isMobile) {
            setIsAnimatingPrev(true);
            setTimeout(() => {
                const pf = bookRef.current?.pageFlip();
                const target = Math.max(0, currentPageRef.current - 1);
                isPrevTurnRef.current = true;
                pf?.turnToPrevPage();
                currentPageRef.current = target;
                setCurrentPage(target);
                setIsAnimatingPrev(false);
            }, 150);
        } else {
            try {
                const pf = bookRef.current?.pageFlip();
                pf?.flipPrev();
            } catch (e) {
                console.error(e);
            }
        }
        setIsFlipping(false);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
            setFsHeight(window.innerHeight);
        } else {
            document.exitFullscreen();
            // isFullscreen se actualiza en el listener fullscreenchange
        }
    };

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => {
        setZoom((prev) => {
            const next = Math.max(prev - 0.25, 1);
            if (next <= 1) setPan({ x: 0, y: 0 });
            return next;
        });
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

    const pageWidth = isMobile ? containerSize.width : containerSize.width / 2;
    const bookHeight = isFullscreen ? fsHeight : containerSize.height;

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                flexDirection: isFullscreen ? "column" : "column-reverse",
                alignItems: "center",
                gap: isFullscreen ? 0 : "1rem",
                padding: isFullscreen ? 0 : isMobile ? "1rem" : "2rem",
                backgroundColor: isFullscreen ? "#0f172a" : "transparent",
                minHeight: isFullscreen ? "100vh" : "auto",
                justifyContent: isFullscreen ? "center" : "flex-start",
                width: "100%",
                position: "relative",
                boxSizing: "border-box",
            }}
        >
            {/* ── Controles ── */}
            <div
                style={
                    isFullscreen
                        ? {
                              position: "fixed",
                              bottom: "1.5rem",
                              left: "50%",
                              transform: "translateX(-50%)",
                              zIndex: 100,
                              display: "flex",
                              gap: "0.4rem",
                              flexWrap: "nowrap",
                              backgroundColor: "rgba(15,23,42,0.7)",
                              backdropFilter: "blur(8px)",
                              padding: "0.5rem 0.875rem",
                              borderRadius: "9999px",
                              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                          }
                        : {
                              display: "flex",
                              gap: isMobile ? "0.25rem" : "0.5rem",
                              flexWrap: "wrap",
                              justifyContent: "center",
                              width: "100%",
                          }
                }
            >
                <button
                    onClick={prevPage}
                    disabled={isFlipping || zoom > 1}
                    className="flex flex-col justify-center items-center"
                    style={btnStyle(
                        isFlipping || zoom > 1,
                        "#3b82f6",
                        isMobile,
                    )}
                >
                    <IconChevronLeft />
                </button>
                <button
                    onClick={nextPage}
                    disabled={isFlipping || zoom > 1}
                    className="flex flex-col items-center justify-center"
                    style={btnStyle(
                        isFlipping || zoom > 1,
                        "#3b82f6",
                        isMobile,
                    )}
                >
                    <IconChevronRight />
                </button>
                <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 1}
                    style={iconBtnStyle(zoom <= 1, "#10b981", isMobile)}
                    className="flex flex-col items-center"
                >
                    <IconZoomOut />
                </button>
                <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                    className="flex flex-col items-center"
                    style={iconBtnStyle(zoom >= 3, "#10b981", isMobile)}
                >
                    <IconZoomIn />
                </button>
                <button
                    onClick={handleReset}
                    disabled={zoom === 1}
                    className="flex flex-col items-center justify-center"
                    style={iconBtnStyle(zoom === 1, "#f59e0b", isMobile)}
                >
                    <IconReset />
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="flex flex-col items-center"
                    style={iconBtnStyle(false, "#8b5cf6", isMobile)}
                >
                    {isFullscreen ? <IconMinimize /> : <IconMaximize />}
                </button>
            </div>

            {/* Zoom indicator */}
            {zoom > 1 && (
                <div
                    style={
                        isFullscreen
                            ? {
                                  position: "fixed",
                                  top: "1rem",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  zIndex: 100,
                                  padding: "0.4rem 1rem",
                                  backgroundColor: "rgba(59,130,246,0.85)",
                                  backdropFilter: "blur(6px)",
                                  color: "white",
                                  borderRadius: "9999px",
                                  fontSize: "0.8rem",
                                  fontWeight: "600",
                              }
                            : {
                                  padding: "0.5rem 1rem",
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  borderRadius: "0.5rem",
                                  fontSize: "0.875rem",
                                  fontWeight: "600",
                              }
                    }
                >
                    Zoom: {(zoom * 100).toFixed(0)}% • Arrastra para moverte
                </div>
            )}

            {/* ── Contenedor del libro ── */}
            <div
                style={{
                    width: "100%",
                    maxWidth: isFullscreen
                        ? "100%"
                        : isMobile
                          ? "100%"
                          : "1200px",
                    height: isFullscreen ? `${fsHeight}px` : "auto",
                    overflow: "hidden",
                    boxShadow: isFullscreen
                        ? "none"
                        : "0 10px 40px rgba(0,0,0,0.3)",
                    borderRadius: isFullscreen ? 0 : "0.5rem",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
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
                        maxWidth: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        ref={bookWrapperRef}
                        style={{
                            width: "100%",
                            maxWidth: "100%",
                            height: `${bookHeight}px`,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "relative",
                            overflow: "hidden",
                            transition: isAnimatingPrev
                                ? "opacity 0.15s ease-out"
                                : "none",
                            opacity: isAnimatingPrev ? 0.3 : 1,
                            boxSizing: "border-box",
                        }}
                    >
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
                            key={`${containerSize.width}-${containerSize.height}-${isMobile}-${orientation}-${isFullscreen}-${fsHeight}`}
                            width={pageWidth}
                            height={bookHeight}
                            size="stretch"
                            usePortrait={isMobile}
                            minWidth={200}
                            maxWidth={isMobile ? containerSize.width : 1400}
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
                            onFlip={(e) => {
                                if (isPrevTurnRef.current) {
                                    isPrevTurnRef.current = false;
                                    return;
                                }
                                currentPageRef.current = e.data;
                                setCurrentPage(e.data);
                            }}
                            style={{
                                minHeight: 0,
                                height: bookHeight,
                                margin: "0 auto",
                                maxWidth: "100%",
                            }}
                        >
                            {pages.map((img, index) => (
                                <Page key={index} imgUrl={img} />
                            ))}
                        </HTMLFlipBook>
                    </div>
                </div>
            </div>

            {/* Hint texto */}
            {!isFullscreen && (
                <p
                    style={{
                        color: "#64748b",
                        fontSize: isMobile ? "0.75rem" : "0.875rem",
                        textAlign: "center",
                        padding: "0 1rem",
                        margin: 0,
                    }}
                >
                    {zoom > 1
                        ? "Arrastra para moverte • Los botones de navegación están deshabilitados con zoom"
                        : isMobile
                          ? "Desliza o usa los botones para cambiar de página"
                          : "Haz clic en los bordes laterales para voltear páginas"}
                </p>
            )}
        </div>
    );
}

function btnStyle(disabled, color, isMobile) {
    return {
        padding: isMobile ? "0.2rem 0.5rem" : "0.5rem 0.5rem",
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
