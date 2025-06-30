# Use the official .NET 9.0 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET 9.0 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["ECommerceApp.API/ECommerceApp.API.csproj", "ECommerceApp.API/"]
COPY ["ECommerceApp.Business/ECommerceApp.Business.csproj", "ECommerceApp.Business/"]
COPY ["ECommerceApp.DataAccess/ECommerceApp.DataAccess.csproj", "ECommerceApp.DataAccess/"]
COPY ["ECommerceApp.Entities/ECommerceApp.Entities.csproj", "ECommerceApp.Entities/"]
COPY ["ECommerceApp.Core/ECommerceApp.Core.csproj", "ECommerceApp.Core/"]

RUN dotnet restore "ECommerceApp.API/ECommerceApp.API.csproj"

# Copy the source code for the required projects only
COPY ["ECommerceApp.API/", "ECommerceApp.API/"]
COPY ["ECommerceApp.Business/", "ECommerceApp.Business/"]
COPY ["ECommerceApp.DataAccess/", "ECommerceApp.DataAccess/"]
COPY ["ECommerceApp.Entities/", "ECommerceApp.Entities/"]
COPY ["ECommerceApp.Core/", "ECommerceApp.Core/"]

# Build the application
WORKDIR "/src/ECommerceApp.API"
RUN dotnet build "ECommerceApp.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish the application
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ECommerceApp.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM base AS final
WORKDIR /app

# Create directories for static files
RUN mkdir -p /app/wwwroot/assets

# Copy published application
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:80

# Create a non-root user
RUN addgroup --gid 1001 --system appgroup && \
    adduser --uid 1001 --system --gid 1001 appuser

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

ENTRYPOINT ["dotnet", "ECommerceApp.API.dll"]
