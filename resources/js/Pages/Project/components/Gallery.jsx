import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./gallery.css";

import "pannellum/build/pannellum.js";
import "pannellum/build/pannellum.css";

export default function Gallery360({ images }) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const viewerRefs = useRef({});
    const viewerInstances = useRef({});

    // const images = [
    //     // { id: 1, url: "https://pannellum.org/images/alma.jpg" },
    //     { id: 2, url: "/projects-images/1.jpg" },
    //     { id: 3, url: "/projects-images/2.jpg" },
    //     { id: 4, url: "/projects-images/3.jpg" },
    //     { id: 5, url: "/projects-images/4.jpg" },
    //     { id: 6, url: "/projects-images/5.jpg" },
    //     { id: 7, url: "/projects-images/6.jpg" },
    //     { id: 8, url: "/projects-images/7.jpg" },
    // ];

    useEffect(() => {
        const img = images[activeIndex];

        // destruir instancia previa
        if (viewerInstances.current[activeIndex]) {
            try {
                viewerInstances.current[activeIndex].destroy();
            } catch {}
        }

        // crear nueva instancia
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

    return (
        <div className="mx-auto p-2">
            <div className="bg-black rounded-lg shadow-lg pb-4">
                <Swiper
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    onSlideChange={(sw) => setActiveIndex(sw.activeIndex)}
                    className="mb-4 rounded-lg"
                    allowTouchMove={false}
                    simulateTouch={false}
                    noSwiping={true}
                    style={{ height: "600px" }}
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

                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={6}
                    freeMode
                    watchSlidesProgress
                    navigation={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    style={{ height: "100px" }}
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
        </div>
    );
}
