# Docker Setup

## Architecture

- **Frontend**: React with React Router (built with Bun)
- **Backend API**: .NET 9 Web API with JWT authentication
- **Worker Service**: .NET 9 background worker for processing orders
- **Database**: SQL Server 2022 Express
- **Message Queue**: RabbitMQ with management interface

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Bun](https://bun.sh/) (for frontend development)
- [PowerShell](https://docs.microsoft.com/en-us/powershell/) (Windows)

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecommerce
   ```

2. **Build and start all services**

   ```powershell
   .\docker-manage.ps1 -Build -Up
   ```

3. **Access the application**
   - **Application**: http://localhost:8080
   - **RabbitMQ Management**: http://localhost:15672 (admin/password)
   - **SQL Server**: localhost:1433 (sa/YourStrong!Passw0rd)

## Available Scripts

### Frontend Build Script

```powershell
# Build frontend and deploy to backend
.\build-and-deploy.ps1

# Build with verbose output
.\build-and-deploy.ps1 -Verbose

# Skip build step (only deploy existing build)
.\build-and-deploy.ps1 -SkipBuild
```

### Docker Management Script

```powershell
# Build frontend and Docker images
.\docker-manage.ps1 -Build

# Start all services
.\docker-manage.ps1 -Up

# Start with clean rebuild
.\docker-manage.ps1 -Up -CleanBuild

# Stop all services
.\docker-manage.ps1 -Down

# Stop and clean volumes
.\docker-manage.ps1 -Down -CleanBuild

# View logs for all services
.\docker-manage.ps1 -Logs

# View logs for specific service
.\docker-manage.ps1 -Logs -Service ecommerce-api
```

## Manual Docker Commands

If you prefer to use Docker commands directly:

```bash
# Build and start all services
docker-compose up --build -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f ecommerce-api

# Clean restart
docker-compose down -v
docker-compose up --build -d
```

## Development Workflow

1. **Frontend Development**

   ```powershell
   cd frontend
   bun install
   bun run dev  # Development server at http://localhost:5173
   ```

2. **Backend Development**

   ```powershell
   cd Backend
   dotnet restore
   dotnet run --project ECommerceApp.API  # API at https://localhost:7290
   ```

3. **Build and Deploy Frontend**

   ```powershell
   .\build-and-deploy.ps1
   ```

4. **Test with Docker**
   ```powershell
   .\docker-manage.ps1 -Build -Up
   ```

## Directory Structure

```
ecommerce/
├── frontend/                 # React frontend application
├── Backend/                  # .NET backend services
│   ├── ECommerceApp.API/    # Web API project
│   ├── ECommerceApp.Worker/ # Background worker service
│   ├── ECommerceApp.Business/   # Business logic layer
│   ├── ECommerceApp.DataAccess/ # Data access layer
│   ├── ECommerceApp.Entities/   # Entity models
│   └── ECommerceApp.Core/       # Core utilities
├── docker-compose.yml       # Docker compose configuration
├── build-and-deploy.ps1    # Frontend build script
└── docker-manage.ps1       # Docker management script
```

## Configuration

### Environment Variables

The application uses the following environment variables in Docker:

- `ConnectionStrings__DefaultConnection`: SQL Server connection string
- `RabbitMQ__Host`: RabbitMQ hostname
- `RabbitMQ__Username`: RabbitMQ username
- `RabbitMQ__Password`: RabbitMQ password

### Database

The SQL Server instance is configured with:

- **Server**: localhost:1433
- **Username**: sa
- **Password**: YourStrong!Passw0rd
- **Database**: ECommerceDB (created automatically)

### RabbitMQ

RabbitMQ is configured with:

- **Host**: localhost:5672
- **Management UI**: http://localhost:15672
- **Username**: admin
- **Password**: password

## Troubleshooting

### Common Issues

1. **Docker is not running**

   - Start Docker Desktop
   - Verify with: `docker version`

2. **Port conflicts**

   - Ensure ports 8080, 1433, 5672, and 15672 are not in use
   - Modify docker-compose.yml if needed

3. **Frontend build fails**

   - Ensure Bun is installed: `bun --version`
   - Check frontend dependencies: `cd frontend && bun install`

4. **Database connection issues**

   - Wait for SQL Server to fully start (may take 30-60 seconds)
   - Check logs: `.\docker-manage.ps1 -Logs -Service sqlserver`

5. **Worker service not processing messages**
   - Check RabbitMQ connection
   - Verify queue creation in management interface

### Useful Commands

```powershell
# Check running containers
docker ps

# View specific container logs
docker logs ecommerce-api

# Access container shell
docker exec -it ecommerce-api /bin/bash

# Check database status
docker exec -it ecommerce-sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd'

# Restart specific service
docker-compose restart ecommerce-api
```

## API Endpoints

Swagger documentation is available at: `http://localhost:8080/swagger`
