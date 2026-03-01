import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function PdfToImages({ pdfUrl, onLoad }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPdf = async () => {
            try {
                const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
                const totalPages = pdf.numPages;

                const images = [];

                for (let i = 1; i <= totalPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2 });

                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({
                        canvasContext: context,
                        viewport,
                    }).promise;

                    images.push(canvas.toDataURL("image/jpeg"));
                }

                onLoad(images);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando PDF:", error);
            }
        };

        if (pdfUrl) {
            loadPdf();
        }
    }, [pdfUrl]);

    if (loading) {
        return <p className="text-center py-6">Cargando revista...</p>;
    }

    return null;
}
