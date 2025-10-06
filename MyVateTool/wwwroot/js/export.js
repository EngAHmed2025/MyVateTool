export async function exportToExcelAndDownload(fileName, rows) {
    if (typeof XLSX === "undefined") {
        // Fallback: generate CSV so the feature keeps working during dev
        const headers = Object.keys(rows[0] || {});
        const escapeCSV = (v) => {
            if (v == null) return "";
            const s = String(v).replace(/"/g, '""');
            return /[",\n]/.test(s) ? `"${s}"` : s;
        };
        const csv = [headers.join(",")]
            .concat(rows.map(r => headers.map(h => escapeCSV(r[h])).join(",")))
            .join("\n");
        const blobUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        await chrome.downloads.download({
            url: blobUrl,
            filename: fileName.endsWith(".csv") ? fileName : `${fileName}.csv`,
            saveAs: true
        });
        return;
    }
    // Original XLSX path
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blobUrl = URL.createObjectURL(new Blob([wbout], { type: "application/octet-stream" }));
    await chrome.downloads.download({
        url: blobUrl,
        filename: fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`,
        saveAs: true
    });
}
