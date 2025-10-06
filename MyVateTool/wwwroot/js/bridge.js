// Moved from inline <script type="module"> in index.html due to MV3 CSP
import { exportToExcelAndDownload } from "./export.js";
        window.ExportHelpers = { exportToExcelAndDownload };

        window.ExtensionBridge = {
            async scrapeFromActiveTab() {
                return await chrome.runtime.sendMessage({ type: "DO_SCRAPE" });
            }
        };
