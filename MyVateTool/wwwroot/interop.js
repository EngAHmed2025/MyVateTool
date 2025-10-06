window.vatHelper = {
    requestInvoices: function (dotnetRef) {
        try {
            // Send message to extension (content script/background) to scrape the page
            chrome.runtime.sendMessage({ type: "SCRAPE_ETA" }, (response) => {
                if (response && response.ok) {
                    // Call the C# method ReceiveInvoices with the scraped data
                    dotnetRef.invokeMethodAsync("ReceiveInvoices", response.data);
                } else {
                    console.error("vatHelper: no invoices received", response);
                    dotnetRef.invokeMethodAsync("ReceiveInvoices", []);
                }
            });
        } catch (err) {
            console.error("vatHelper.requestInvoices error", err);
            dotnetRef.invokeMethodAsync("ReceiveInvoices", []);
        }
    }
};
