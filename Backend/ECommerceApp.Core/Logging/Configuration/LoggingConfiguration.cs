namespace ECommerceApp.Core.Logging.Configuration;

public class LoggingConfiguration
{
  public LogLevel MinimumLogLevel { get; set; } = LogLevel.Information;
  public bool IncludeTimestamp { get; set; } = true;
  public bool IncludeLogLevel { get; set; } = true;
  public bool IncludeCategoryName { get; set; } = true;
  public string DateTimeFormat { get; set; } = "yyyy-MM-dd HH:mm:ss.fff";
}
