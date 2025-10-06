
async function requestScrapeFromActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab");
    return chrome.tabs.sendMessage(tab.id, { type: "DO_SCRAPE" });
}


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg?.type === "DO_SCRAPE") {
        (async () => {
            try {
                const res = await requestScrapeFromActiveTab();
                sendResponse(res);
            } catch (e) {
                sendResponse({ ok: false, error: String(e) });
            }
        })();
        return true; 
    }
});
