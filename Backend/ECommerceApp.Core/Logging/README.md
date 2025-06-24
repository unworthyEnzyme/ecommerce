# Logging System Documentation

## Overview

This project includes a simple, extensible logging mechanism that allows you to easily add logging throughout your application while keeping the implementation details abstracted.

## Key Components

### 1. ILogger Interface

The main interface that defines logging methods for different log levels:

- `LogTrace()` - For detailed diagnostic information
- `LogDebug()` - For debugging information
- `LogInfo()` - For general information
- `LogWarning()` - For potentially harmful situations
- `LogError()` - For error conditions
- `LogCritical()` - For critical failures

### 2. ILoggerFactory Interface

Factory interface for creating loggers with specific category names.

### 3. ConsoleLogger Implementation

A basic implementation that outputs logs to the console with formatted messages including:

- Timestamp (UTC)
- Log level
- Category name
- Message

### 4. LogLevel Enum

Defines the available log levels: Trace, Debug, Information, Warning, Error, Critical

## Setup

### In your Program.cs

Add the logging service to your dependency injection container:

```csharp
using ECommerceApp.Core.Logging.Extensions;

// Add console logging with minimum log level
builder.Services.AddConsoleLogging(ECommerceApp.Core.Logging.LogLevel.Information);
```

### Alternative: Custom Logger Implementation

If you want to use a different logger implementation:

```csharp
using ECommerceApp.Core.Logging.Extensions;

// Add your custom logger factory
builder.Services.AddCustomLogging(new YourCustomLoggerFactory());
```

## Usage Examples

### Option 1: Inject ILoggerFactory (Recommended)

```csharp
public class ProductService
{
    private readonly ILogger _logger;

    public ProductService(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<ProductService>();
    }

    public async Task<Product> GetProductAsync(int id)
    {
        _logger.LogInfo("Getting product with ID: {0}", id);

        try
        {
            var product = await _repository.GetByIdAsync(id);
            if (product == null)
            {
                _logger.LogWarning("Product with ID {0} not found", id);
                return null;
            }

            _logger.LogInfo("Successfully retrieved product: {0}", product.Name);
            return product;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product with ID: {0}", id);
            throw;
        }
    }
}
```

### Option 2: Inject ILogger Directly

```csharp
public class OrderController : ControllerBase
{
    private readonly ILogger _logger;

    public OrderController(ILogger logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
    {
        _logger.LogInfo("Creating new order for user: {0}", dto.UserId);

        // Your logic here

        _logger.LogInfo("Order created successfully with ID: {0}", order.Id);
        return Ok(order);
    }
}
```

### Option 3: Using Service Provider Extensions

```csharp
public class SomeService
{
    private readonly ILogger _logger;

    public SomeService(IServiceProvider serviceProvider)
    {
        _logger = serviceProvider.CreateLogger<SomeService>();
    }
}
```

## Sample Output

When logging, you'll see formatted output like this:

```
[2025-06-24 10:30:15.123] [INFO ] [ProductService] Getting product with ID: 42
[2025-06-24 10:30:15.456] [WARN ] [ProductService] Product with ID 42 not found
[2025-06-24 10:30:15.789] [ERROR] [OrderService] Error processing order
Exception: System.InvalidOperationException: Database connection failed
   at OrderService.ProcessOrder(Order order) in /path/to/OrderService.cs:line 25
```

## Extending the System

### Creating a Custom Logger Implementation

```csharp
public class FileLogger : ILogger
{
    private readonly string _filePath;
    private readonly string _categoryName;

    public FileLogger(string categoryName, string filePath)
    {
        _categoryName = categoryName;
        _filePath = filePath;
    }

    public void LogInfo(string message)
    {
        WriteToFile(LogLevel.Information, message);
    }

    // Implement other methods...

    private void WriteToFile(LogLevel level, string message)
    {
        var logEntry = $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss.fff}] [{level}] [{_categoryName}] {message}";
        File.AppendAllText(_filePath, logEntry + Environment.NewLine);
    }
}
```

### Creating a Custom Logger Factory

```csharp
public class FileLoggerFactory : ILoggerFactory
{
    private readonly string _basePath;

    public FileLoggerFactory(string basePath)
    {
        _basePath = basePath;
    }

    public ILogger CreateLogger(string categoryName)
    {
        var filePath = Path.Combine(_basePath, $"{categoryName}.log");
        return new FileLogger(categoryName, filePath);
    }

    public ILogger CreateLogger<T>()
    {
        return CreateLogger(typeof(T).Name);
    }
}
```

## Best Practices

1. **Use ILoggerFactory**: Inject `ILoggerFactory` rather than `ILogger` directly when possible, so you can create loggers with meaningful category names.

2. **Category Names**: Use class names as categories for easy identification of log sources.

3. **Log Levels**:

   - Use `Trace` for very detailed diagnostic information
   - Use `Debug` for debugging during development
   - Use `Info` for general application flow
   - Use `Warning` for unexpected but non-critical situations
   - Use `Error` for error conditions that don't stop the application
   - Use `Critical` for failures that require immediate attention

4. **Structured Logging**: Use parameter placeholders (`{0}`, `{1}`) instead of string concatenation for better performance.

5. **Exception Logging**: Use the `LogError(Exception, string)` overloads to include full exception details.

6. **Performance**: Consider the minimum log level in production to avoid performance overhead from verbose logging.

## Configuration Options

The `LoggingConfiguration` class allows for future extensibility:

- `MinimumLogLevel`: Set the minimum level to log
- `IncludeTimestamp`: Whether to include timestamps
- `IncludeLogLevel`: Whether to include log level in output
- `IncludeCategoryName`: Whether to include category names
- `DateTimeFormat`: Format for timestamps

This logging system is designed to be simple yet extensible, allowing you to start with console logging and easily switch to more sophisticated implementations as your needs grow.
