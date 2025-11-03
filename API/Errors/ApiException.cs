namespace API.Errors;

public class ApiException(int code, string message, string? details)
{
    public int StatusCode { get; set; } = code;
    public string Message { get; set; } = message;
    public string? Details { get; set; } = details;
}