import { useEffect, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";

GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfToImages({ pdfUrl, onLoad }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadPdf = async () => {
            try {
                setLoading(true);
                const pdf = await getDocument(pdfUrl).promise;
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
                setLoading(false);
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
