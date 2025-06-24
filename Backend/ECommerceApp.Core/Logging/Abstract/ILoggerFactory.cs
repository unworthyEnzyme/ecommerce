using ECommerceApp.Core.Logging.Abstract;

namespace ECommerceApp.Core.Logging.Abstract;

public interface ILoggerFactory
{
  ILogger CreateLogger(string categoryName);
  ILogger CreateLogger<T>();
}
