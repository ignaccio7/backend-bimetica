import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export function usePdfToImages(pdfUrl) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const loadPdf = async () => {
            const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
            const pages = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2 });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                }).promise;

                pages.push(canvas.toDataURL("image/jpeg", 0.8));
            }

            setImages(pages);
        };

        if (pdfUrl) loadPdf();
    }, [pdfUrl]);

    return images;
}
