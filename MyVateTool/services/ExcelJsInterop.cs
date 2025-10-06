using System.Text.Json;
using Microsoft.JSInterop;

public class ExcelJsInterop
{
    private readonly IJSRuntime _js;
    public ExcelJsInterop(IJSRuntime js) => _js = js;


    public async Task<List<Dictionary<string, object>>> ParseExcelAsync(byte[] fileBytes)
    {
        
        var jsonStr = await _js.InvokeAsync<string>("excelInterop.parseArrayBuffer", (object)fileBytes);
        var doc = JsonDocument.Parse(jsonStr);
        if (doc.RootElement.GetProperty("ok").GetBoolean())
        {
            var dataJson = doc.RootElement.GetProperty("data").GetRawText();
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var list = JsonSerializer.Deserialize<List<Dictionary<string, object>>>(dataJson, options);
            return list ?? new List<Dictionary<string, object>>();
        }
        else
        {
            var err = doc.RootElement.GetProperty("error").GetString();
            throw new Exception("Excel parse error: " + err);
        }
    }

    public async Task ExportJsonAsExcelAsync<T>(IEnumerable<T> items, string filename = "export.xlsx")
    {
        var json = JsonSerializer.Serialize(items);
        await _js.InvokeVoidAsync("excelInterop.exportJsonAsExcel", json, filename);
    }
}
