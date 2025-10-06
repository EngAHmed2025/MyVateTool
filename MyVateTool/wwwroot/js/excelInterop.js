window.excelInterop = {
  
    parseArrayBuffer: function (arrayBuffer) {
        try {
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false, cellDates: true, dateNF: 'yyyy-mm-dd' });
            return JSON.stringify({ ok: true, data: json });
        } catch (e) {
            return JSON.stringify({ ok: false, error: String(e) });
        }
    },

  
    exportJsonAsExcel: function (jsonString, filename) {
        const data = JSON.parse(jsonString);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        saveAs(blob, filename || "export.xlsx");
        return true;
    }
};
