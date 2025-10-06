function scrapeInvoicesFromDom() {
    const table = document.querySelector("table");
    if (!table) return [];

    const rows = Array.from(table.querySelectorAll("tr"));
    const headerCells = rows.shift()?.querySelectorAll("th,td") || [];
    const headers = Array.from(headerCells).map(h => (h.textContent || "").trim());

    return rows.map(r => {
        const cells = Array.from(r.querySelectorAll("td")).map(td => (td.textContent || "").trim());
        const obj = {};
        cells.forEach((v, i) => obj[headers[i] || `col${i + 1}`] = v);
        return obj;
    });
}


window.addEventListener("message", (event) => {
    if (event.data?.type === "GET_INVOICES") {
        const data = scrapeInvoicesFromDom();
        window.postMessage({ type: "INVOICES_DATA", data }, "*");
    }
});

window.addEventListener("load", () => {
    console.log("Injecting Blazor app...");

    let container = document.createElement("div");
    container.id = "my-vat-tool-container";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.right = "0";
    container.style.width = "400px";
    container.style.height = "100%";
    container.style.zIndex = 99999;
    container.style.background = "#fff";
    container.style.borderLeft = "2px solid #ccc";
    container.style.boxShadow = "-2px 0 8px rgba(0,0,0,0.2)";

    let iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("blazorApp/index.html");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    container.appendChild(iframe);
    document.body.appendChild(container);
});



chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === "DO_SCRAPE") {
        const data = scrapeInvoicesFromDom();
        sendResponse({ ok: true, data });
        return true;
    }
});
