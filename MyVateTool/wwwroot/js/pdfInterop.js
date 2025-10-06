window.pdfInterop = {
    extractTextFromPdfArrayBuffer: async function (arrayBuffer) {
        try {
          
            return JSON.stringify({ ok: false, error: "pdf text extraction: implement with pdfjs-dist" });
        } catch (e) {
            return JSON.stringify({ ok: false, error: String(e) });
        }
    },

    createPdfFromHtml: function (htmlString, filename) {
   
        return JSON.stringify({ ok: false, error: "implement createPdfFromHtml if needed" });
    }
};
