using Blazored.LocalStorage;

namespace MyVateTool.Services
{
    public class UserSettingsService
    {
        private const string StorageKey = "userSettings";
        private readonly ILocalStorageService _localStorage;

        public UserSettingsService(ILocalStorageService localStorage)
        {
            _localStorage = localStorage;
        }

        public async Task<UserSettings> GetSettingsAsync()
        {
            var settings = await _localStorage.GetItemAsync<UserSettings>(StorageKey);
            if (settings == null)
            {
                settings = UserSettings.CreateDefault();
                await SaveSettingsAsync(settings);
                return settings;
            }

            settings.Normalize();
            return settings;
        }

        public async Task SaveSettingsAsync(UserSettings settings)
        {
            settings.Normalize();
            await _localStorage.SetItemAsync(StorageKey, settings);
        }
    }

    public class UserSettings
    {
        private decimal _vatRate = 0.14m;

        public decimal VatRate
        {
            get => _vatRate;
            set => _vatRate = Clamp(value, 0m, 1m);
        }

        public string CurrencySymbol { get; set; } = "£";

        public bool AutoDownloadReports { get; set; } = true;

        public static UserSettings CreateDefault() => new();

        internal void Normalize()
        {
            VatRate = Clamp(VatRate, 0m, 1m);
            CurrencySymbol = string.IsNullOrWhiteSpace(CurrencySymbol)
                ? "£"
                : CurrencySymbol.Trim();
        }

        private static decimal Clamp(decimal value, decimal min, decimal max)
        {
            if (value < min)
            {
                return min;
            }

            if (value > max)
            {
                return max;
            }

            return value;
        }
    }
}
