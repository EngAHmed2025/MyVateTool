using Blazored.LocalStorage;
using System.Globalization;

namespace MyVateTool.Services
{
    public class InvoiceService
    {
        private readonly ILocalStorageService _localStorage;
        private readonly UserSettingsService _settingsService;

        public InvoiceService(ILocalStorageService localStorage, UserSettingsService settingsService)
        {
            _localStorage = localStorage;
            _settingsService = settingsService;
        }

        public async Task<List<Invoice>> GetSalesInvoicesAsync()
        {
            var data = await LoadInvoicesAsync();
            return data.Where(i => i.Type.Equals("Sales", StringComparison.OrdinalIgnoreCase)).ToList();
        }

        public async Task<List<Invoice>> GetPurchaseInvoicesAsync()
        {
            var data = await LoadInvoicesAsync();
            return data.Where(i => i.Type.Equals("Purchase", StringComparison.OrdinalIgnoreCase)).ToList();
        }

        public async Task<decimal> CalculateTaxReturnAsync()
        {
            var data = await LoadInvoicesAsync();
            var settings = await _settingsService.GetSettingsAsync();
            return data.Sum(i => i.Amount * settings.VatRate);
        }

        public IEnumerable<Invoice> ConvertToInvoices(IEnumerable<Dictionary<string, object>> raw)
            => raw.Select(MapToInvoice);

        private async Task<List<Invoice>> LoadInvoicesAsync()
        {
            var raw = await _localStorage.GetItemAsync<List<Dictionary<string, object>>>("invoices")
                      ?? new();

            return raw.Select(MapToInvoice).ToList();
        }

        private Invoice MapToInvoice(Dictionary<string, object> d)
        {
            return new Invoice
            {
                InvoiceNumber = d.TryGetValue("InvoiceNo", out var v1) ? v1?.ToString() ?? "" :
                                d.TryGetValue("رقم الفاتورة", out var v2) ? v2?.ToString() ?? "" : "",
                Date = ParseDate(d, "Date", "التاريخ"),
                Amount = ParseDecimal(d, "Total", "الإجمالي", "إجمالي"),
                Type = d.TryGetValue("Type", out var t) ? t?.ToString() ?? "" : ""
            };
        }

        private static DateTime ParseDate(Dictionary<string, object> d, params string[] keys)
        {
            foreach (var k in keys)
            {
                if (d.TryGetValue(k, out var v) && v != null)
                {
                    if (DateTime.TryParse(v.ToString(), out var dt))
                        return dt;
                }
            }
            return DateTime.MinValue;
        }

        private static decimal ParseDecimal(Dictionary<string, object> d, params string[] keys)
        {
            foreach (var k in keys)
            {
                if (d.TryGetValue(k, out var v) && v != null)
                {
                    if (decimal.TryParse(v.ToString(),
                        NumberStyles.Any,
                        CultureInfo.InvariantCulture,
                        out var dec))
                        return dec;

                    if (decimal.TryParse(v.ToString(), out dec))
                        return dec;
                }
            }
            return 0m;
        }
    }

    public class Invoice
    {
        public string InvoiceNumber { get; set; } = "";
        public DateTime Date { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = ""; // Sales / Purchase
    }
}
