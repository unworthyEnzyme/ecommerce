using ECommerceApp.Core.Logging.Abstract;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerceApp.Core.Logging.Extensions;

public static class LoggerExtensions
{
  /// <summary>
  /// Creates a logger with the specified type name as category
  /// </summary>
  /// <typeparam name="T">The type to use for the category name</typeparam>
  /// <param name="serviceProvider">The service provider</param>
  /// <returns>A logger instance</returns>
  public static ILogger CreateLogger<T>(this IServiceProvider serviceProvider)
  {
    var factory = serviceProvider.GetRequiredService<ILoggerFactory>();
    return factory.CreateLogger<T>();
  }

  /// <summary>
  /// Creates a logger with the specified category name
  /// </summary>
  /// <param name="serviceProvider">The service provider</param>
  /// <param name="categoryName">The category name</param>
  /// <returns>A logger instance</returns>
  public static ILogger CreateLogger(this IServiceProvider serviceProvider, string categoryName)
  {
    var factory = serviceProvider.GetRequiredService<ILoggerFactory>();
    return factory.CreateLogger(categoryName);
  }
}
