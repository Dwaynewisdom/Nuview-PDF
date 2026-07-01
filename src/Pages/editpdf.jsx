import { useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Use CDN-hosted worker matched to react-pdf's internal pdfjs version
// This avoids base path / bundler conflicts with local imports
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const SCALE = 1.5;

export default function PdfEditor() {
  const [fileBytes, setFileBytes] = useState(null); // original bytes, kept for export
  const [fileUrl, setFileUrl] = useState(null); // object URL for react-pdf display
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [mode, setMode] = useState("edit"); // "edit" | "preview"
  const [items, setItems] = useState({}); // { pageNum: [ {id, str, screenX, screenY, width, height, fontSize, pdfX, pdfY, pdfWidth, pdfFontSize} ] }
  const [edits, setEdits] = useState({}); // { itemId: newText }
  const [exporting, setExporting] = useState(false);
  const pageBoxRef = useRef(null);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buf = await file.arrayBuffer();
    setFileBytes(buf.slice(0)); // keep an untouched copy
    setFileUrl(URL.createObjectURL(new Blob([buf], { type: "application/pdf" })));
    setItems({});
    setEdits({});
    setPageNum(1);
  };

  // Pull text items + positions once a page has rendered, so overlay lines up with the canvas
  const onPageRender = useCallback(
    async (page) => {
      if (items[pageNum]) return; // already extracted
      const viewport = page.getViewport({ scale: SCALE });
      const textContent = await page.getTextContent();

      const extracted = textContent.items
        .filter((it) => it.str.trim().length > 0)
        .map((it, i) => {
          const tx = pdfjs.Util.transform(viewport.transform, it.transform);
          const fontHeight = Math.hypot(tx[2], tx[3]);
          const pdfFontSize = Math.hypot(it.transform[2], it.transform[3]);
          return {
            id: `${pageNum}-${i}`,
            str: it.str,
            screenX: tx[4],
            screenY: tx[5] - fontHeight,
            width: it.width * SCALE,
            height: fontHeight * 1.15,
            fontSize: fontHeight,
            pdfX: it.transform[4],
            pdfY: it.transform[5],
            pdfWidth: it.width,
            pdfFontSize,
          };
        });

      setItems((prev) => ({ ...prev, [pageNum]: extracted }));
    },
    [items, pageNum]
  );

  const handleEdit = (id, newText) => {
    setEdits((prev) => ({ ...prev, [id]: newText }));
  };

  const exportPdf = async () => {
    if (!fileBytes) return;
    setExporting(true);
    try {
      const pdfDoc = await PDFDocument.load(fileBytes);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const [pStr, pageItems] of Object.entries(items)) {
        const p = Number(pStr) - 1;
        const page = pdfDoc.getPage(p);
        for (const it of pageItems) {
          const newText = edits[it.id];
          if (newText === undefined || newText === it.str) continue;

          // cover the original text, then draw the edited string in its place
          page.drawRectangle({
            x: it.pdfX - 1,
            y: it.pdfY - it.pdfFontSize * 0.25,
            width: it.pdfWidth + 2,
            height: it.pdfFontSize * 1.2,
            color: rgb(1, 1, 1),
          });
          page.drawText(newText, {
            x: it.pdfX,
            y: it.pdfY,
            size: it.pdfFontSize,
            font,
            color: rgb(0, 0, 0),
          });
        }
      }

      const out = await pdfDoc.save();
      const blob = new Blob([out], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "edited.pdf";
      a.click();
    } finally {
      setExporting(false);
    }
  };

  const pageItems = items[pageNum] || [];

  return (
    <div className="min-h-screen bg-white text-neutral-100 flex flex-col">
      {/* Toolbar */}
      <header className="flex items-center gap-4 px-6 py-3 border-b border-neutral-800 bg-orange-700">
        <label className="text-sm px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 cursor-pointer">
          Open PDF
          <input type="file" accept="application/pdf" onChange={onFileChange} className="hidden" />
        </label>

        {fileUrl && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setPageNum((n) => Math.max(1, n - 1))}
                disabled={pageNum <= 1}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40"
              >
                ‹
              </button>
              <span>
                Page {pageNum} / {numPages}
              </span>
              <button
                onClick={() => setPageNum((n) => Math.min(numPages, n + 1))}
                disabled={pageNum >= numPages}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40"
              >
                ›
              </button>
            </div>

            <div className="flex items-center gap-1 ml-4 text-sm bg-neutral-800 rounded-md p-1">
              <button
                onClick={() => setMode("edit")}
                className={`px-3 py-1 rounded ${mode === "edit" ? "bg-amber-500 text-black" : "hover:bg-neutral-700"}`}
              >
                Edit
              </button>
              <button
                onClick={() => setMode("preview")}
                className={`px-3 py-1 rounded ${mode === "preview" ? "bg-amber-500 text-black" : "hover:bg-neutral-700"}`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={exportPdf}
              disabled={exporting}
              className="ml-auto px-4 py-1.5 rounded-md bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 disabled:opacity-50"
            >
              {exporting ? "Exporting…" : "Download edited PDF"}
            </button>
          </>
        )}
      </header>

      {/* Canvas area */}
      <main className="flex-1 overflow-auto flex justify-center py-8">
        {!fileUrl ? (
          <p className="text-neutral-500 text-sm mt-10">Upload a PDF to start editing.</p>
        ) : (
          <div ref={pageBoxRef} className="relative shadow-2xl" style={{ width: "fit-content" }}>
            <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
              <Page
                pageNumber={pageNum}
                scale={SCALE}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onRenderSuccess={onPageRender}
              />
            </Document>

            {/* Text overlay, aligned to the extracted item coordinates */}
            {pageItems.map((it) => (
              <div
                key={it.id}
                contentEditable={mode === "edit"}
                suppressContentEditableWarning
                onBlur={(e) => handleEdit(it.id, e.currentTarget.textContent)}
                className={
                  mode === "edit"
                    ? "absolute outline-dashed outline-1 outline-amber-400/60 bg-amber-400/10 focus:bg-neutral-900 focus:text-white cursor-text"
                    : "absolute"
                }
                style={{
                  left: it.screenX,
                  top: it.screenY,
                  minWidth: it.width,
                  minHeight: it.height,
                  fontSize: it.fontSize,
                  lineHeight: `${it.height}px`,
                  color: mode === "preview" ? "transparent" : undefined,
                  whiteSpace: "pre",
                }}
              >
                {edits[it.id] ?? it.str}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}