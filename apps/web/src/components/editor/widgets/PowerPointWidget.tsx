import React, { useEffect, useMemo, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PowerPointConfig } from "../../../types/widgets";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PowerPointWidgetProps {
  config: PowerPointConfig;
  currentTime: number;
}

export const PowerPointWidget: React.FC<PowerPointWidgetProps> = ({
  config,
  currentTime,
}) => {
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [pageImage, setPageImage] = useState<string>("");

  useEffect(() => {
    if (!config.file) {
      setPdfDoc(null);
      setPageImage("");
      return;
    }

    let active = true;
    (async () => {
      setIsConverting(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", config.file!);
      const response = await fetch("/api/convert-pptx", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("PowerPoint conversion failed");
      const blob = await response.blob();
      const bytes = await blob.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      if (active) setPdfDoc(doc);
    })()
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (active) setIsConverting(false);
      });

    return () => {
      active = false;
    };
  }, [config.file]);

  const pageIndex = useMemo(() => {
    const secondsPerSlide = Math.max(1, config.secondsPerSlide);
    const slides = Math.max(1, config.totalSlides || pdfDoc?.numPages || 1);
    const raw = Math.floor(currentTime / secondsPerSlide);
    return config.loop ? raw % slides : Math.min(raw, slides - 1);
  }, [config.secondsPerSlide, config.totalSlides, config.loop, pdfDoc?.numPages, currentTime]);

  useEffect(() => {
    if (!pdfDoc) return;
    let active = true;

    (async () => {
      const page = await pdfDoc.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale: 1.1 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      if (active) setPageImage(canvas.toDataURL("image/png"));
    })().catch((e) => console.error("PowerPoint page render failed", e));

    return () => {
      active = false;
    };
  }, [pdfDoc, pageIndex]);

  if (isConverting) {
    return <div className="text-white bg-black/70 px-3 py-1 rounded">Converting PowerPoint...</div>;
  }
  if (error) {
    return <div className="text-red-200 bg-red-900/70 px-3 py-1 rounded">{error}</div>;
  }
  if (!pageImage) return null;

  const totalSlides = config.totalSlides || pdfDoc?.numPages || 0;
  return (
    <div className="w-full h-full pointer-events-none flex items-center justify-center">
      <img src={pageImage} alt="Slide preview" className="max-w-[90%] max-h-[90%] object-contain" />
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Slide {pageIndex + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default PowerPointWidget;
