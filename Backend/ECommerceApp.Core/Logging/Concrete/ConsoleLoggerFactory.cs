using ECommerceApp.Core.Logging.Abstract;

namespace ECommerceApp.Core.Logging.Concrete;

public class ConsoleLoggerFactory(LogLevel minimumLogLevel = LogLevel.Information) : ILoggerFactory
{
  private readonly LogLevel _minimumLogLevel = minimumLogLevel;

  public ILogger CreateLogger(string categoryName)
  {
    return new ConsoleLogger(categoryName, _minimumLogLevel);
  }

  public ILogger CreateLogger<T>()
  {
    return CreateLogger(typeof(T).Name);
  }
}
