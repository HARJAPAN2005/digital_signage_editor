import React, { useEffect, useMemo, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PDFConfig } from "../../../types/widgets";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface PDFWidgetProps {
  config: PDFConfig;
  currentTime: number;
}

export const PDFWidget: React.FC<PDFWidgetProps> = ({ config, currentTime }) => {
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
      const bytes = await config.file!.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: bytes }).promise;
      if (active) setPdfDoc(doc);
    })().catch((error) => console.error("PDF load failed", error));

    return () => {
      active = false;
    };
  }, [config.file]);

  const pageIndex = useMemo(() => {
    const secondsPerPage = Math.max(1, config.secondsPerPage);
    const pages = Math.max(1, config.totalPages || pdfDoc?.numPages || 1);
    const raw = Math.floor(currentTime / secondsPerPage);
    return config.loop ? raw % pages : Math.min(raw, pages - 1);
  }, [config.secondsPerPage, config.totalPages, config.loop, pdfDoc?.numPages, currentTime]);

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
    })().catch((error) => console.error("PDF page render failed", error));

    return () => {
      active = false;
    };
  }, [pdfDoc, pageIndex]);

  if (!pageImage) return null;

  const totalPages = config.totalPages || pdfDoc?.numPages || 0;
  return (
    <div className="w-full h-full pointer-events-none flex items-center justify-center">
      <img src={pageImage} alt="PDF page" className="max-w-[90%] max-h-[90%] object-contain" />
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        Page {pageIndex + 1} / {totalPages}
      </div>
    </div>
  );
};

export default PDFWidget;
