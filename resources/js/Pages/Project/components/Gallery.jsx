import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./gallery.css";

// Íconos inline para no depender de imports externos
function IconExpand() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
    );
}

function IconCompress() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="10" y1="14" x2="3" y2="21" />
            <line x1="21" y1="3" x2="14" y2="10" />
        </svg>
    );
}

export default function Gallery360({ images, mainHeight = 600 }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const viewerRefs = useRef({});
    const viewerInstances = useRef({});
    const containerRef = useRef(null);

    useEffect(() => {
        // Sincronizar estado si el usuario sale con Escape
        const handleFsChange = () => {
            if (!document.fullscreenElement) {
                setIsFullscreen(false);
            }
        };
        document.addEventListener("fullscreenchange", handleFsChange);
        return () =>
            document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    useEffect(() => {
        const img = images[activeIndex];

        if (viewerInstances.current[activeIndex]) {
            try {
                viewerInstances.current[activeIndex].destroy();
            } catch {}
        }

        if (viewerRefs.current[activeIndex]) {
            try {
                viewerInstances.current[activeIndex] = window.pannellum.viewer(
                    viewerRefs.current[activeIndex],
                    {
                        type: "equirectangular",
                        panorama: img.url,
                        autoLoad: true,
                        showControls: false,
                    },
                );
            } catch (e) {
                console.error("Error Pannellum:", e);
            }
        }

        return () => {
            if (viewerInstances.current[activeIndex]) {
                try {
                    viewerInstances.current[activeIndex].destroy();
                } catch {}
            }
        };
    }, [activeIndex]);

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // En fullscreen el visor principal ocupa todo el espacio disponible
    const activeMainHeight = isFullscreen
        ? `calc(100vh - 120px)` // deja espacio para thumbs abajo
        : `${mainHeight}px`;

    return (
        <div
            ref={containerRef}
            style={{
                backgroundColor: "#000",
                borderRadius: isFullscreen ? 0 : "0.5rem",
                padding: isFullscreen ? "0" : "0.5rem",
                // Necesario para que el botón absoluto se posicione bien
                position: "relative",
            }}
        >
            {/* ── Botón fullscreen ── */}
            <button
                onClick={toggleFullscreen}
                title={
                    isFullscreen
                        ? "Salir de pantalla completa"
                        : "Pantalla completa"
                }
                style={{
                    position: "absolute",
                    top: isFullscreen ? "1rem" : "1.25rem",
                    left: isFullscreen ? "1rem" : "1.25rem",
                    zIndex: 50,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    backgroundColor: "rgba(15,23,42,0.75)",
                    backdropFilter: "blur(6px)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    transition: "background-color 0.15s ease",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                        "rgba(15,23,42,0.95)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                        "rgba(15,23,42,0.75)")
                }
            >
                {isFullscreen ? <IconCompress /> : <IconExpand />}
            </button>

            {/* ── Visor principal ── */}
            <Swiper
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                onSlideChange={(sw) => setActiveIndex(sw.activeIndex)}
                className="mb-4 rounded-lg"
                allowTouchMove={false}
                simulateTouch={false}
                noSwiping={true}
                style={{
                    height: activeMainHeight,
                    transition: "height 0.3s ease",
                }}
            >
                {images.map((img, index) => (
                    <SwiperSlide key={img.id}>
                        <div
                            ref={(el) => (viewerRefs.current[index] = el)}
                            className="w-full h-full rounded-lg"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ── Miniaturas ── */}
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={6}
                freeMode
                watchSlidesProgress
                navigation={true}
                modules={[FreeMode, Navigation, Thumbs]}
                style={{
                    height: isFullscreen ? "100px" : "100px",
                    padding: isFullscreen ? "0 1rem" : "0",
                }}
            >
                {images.map((img) => (
                    <SwiperSlide key={img.id}>
                        <img
                            src={img.url}
                            className="w-full h-full object-cover rounded"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
