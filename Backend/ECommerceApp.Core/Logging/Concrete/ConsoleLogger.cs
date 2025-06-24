using ECommerceApp.Core.Logging.Abstract;

namespace ECommerceApp.Core.Logging.Concrete;

public class ConsoleLogger : ILogger
{
  private readonly string _categoryName;
  private readonly LogLevel _minimumLogLevel;

  public ConsoleLogger(string categoryName, LogLevel minimumLogLevel = LogLevel.Information)
  {
    _categoryName = categoryName;
    _minimumLogLevel = minimumLogLevel;
  }

  public void LogTrace(string message) => Log(LogLevel.Trace, message);
  public void LogDebug(string message) => Log(LogLevel.Debug, message);
  public void LogInfo(string message) => Log(LogLevel.Information, message);
  public void LogWarning(string message) => Log(LogLevel.Warning, message);
  public void LogError(string message) => Log(LogLevel.Error, message);
  public void LogCritical(string message) => Log(LogLevel.Critical, message);

  public void LogTrace(string message, params object[] args) => Log(LogLevel.Trace, message, args);
  public void LogDebug(string message, params object[] args) => Log(LogLevel.Debug, message, args);
  public void LogInfo(string message, params object[] args) => Log(LogLevel.Information, message, args);
  public void LogWarning(string message, params object[] args) => Log(LogLevel.Warning, message, args);
  public void LogError(string message, params object[] args) => Log(LogLevel.Error, message, args);
  public void LogCritical(string message, params object[] args) => Log(LogLevel.Critical, message, args);

  public void LogError(Exception exception, string message)
  {
    if (!ShouldLog(LogLevel.Error)) return;

    var formattedMessage = FormatMessage(LogLevel.Error, message);
    Console.WriteLine(formattedMessage);
    Console.WriteLine($"Exception: {exception}");
  }

  public void LogError(Exception exception, string message, params object[] args)
  {
    if (!ShouldLog(LogLevel.Error)) return;

    var finalMessage = args?.Length > 0 ? FormatStructuredMessage(message, args) : message;
    var formattedMessage = FormatMessage(LogLevel.Error, finalMessage);
    Console.WriteLine(formattedMessage);
    Console.WriteLine($"Exception: {exception}");
  }

  private void Log(LogLevel logLevel, string message, params object[]? args)
  {
    if (!ShouldLog(logLevel)) return;

    var finalMessage = args?.Length > 0 ? FormatStructuredMessage(message, args) : message;
    var formattedMessage = FormatMessage(logLevel, finalMessage);

    Console.WriteLine(formattedMessage);
  }

  private bool ShouldLog(LogLevel logLevel) => logLevel >= _minimumLogLevel;

  private string FormatStructuredMessage(string message, object[] args)
  {
    try
    {
      // Simple structured logging support - replace {0}, {1}, etc. with provided args
      // If the message uses named placeholders like {Email}, convert to indexed placeholders
      var formattedMessage = message;

      // Replace named placeholders with indexed ones for string.Format compatibility
      var placeholderIndex = 0;
      while (formattedMessage.Contains("{") && placeholderIndex < args.Length)
      {
        var startIndex = formattedMessage.IndexOf('{');
        var endIndex = formattedMessage.IndexOf('}', startIndex);

        if (startIndex >= 0 && endIndex > startIndex)
        {
          var placeholder = formattedMessage.Substring(startIndex, endIndex - startIndex + 1);
          formattedMessage = formattedMessage.Replace(placeholder, $"{{{placeholderIndex}}}");
          placeholderIndex++;
        }
        else
        {
          break;
        }
      }

      return string.Format(formattedMessage, args);
    }
    catch
    {
      // Fallback: if formatting fails, return the original message with args appended
      return $"{message} [Args: {string.Join(", ", args)}]";
    }
  }

  private string FormatMessage(LogLevel logLevel, string message)
  {
    var timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss.fff");
    var levelString = GetLogLevelString(logLevel);
    return $"[{timestamp}] [{levelString}] [{_categoryName}] {message}";
  }

  private static string GetLogLevelString(LogLevel logLevel) => logLevel switch
  {
    LogLevel.Trace => "TRACE",
    LogLevel.Debug => "DEBUG",
    LogLevel.Information => "INFO ",
    LogLevel.Warning => "WARN ",
    LogLevel.Error => "ERROR",
    LogLevel.Critical => "CRIT ",
    _ => "UNKNOWN"
  };
}
