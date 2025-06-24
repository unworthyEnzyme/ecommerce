import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Package,
  PlusCircle,
  Settings,
  ShoppingCart,
  Tag,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import apiClient from "~/api/client";
import type { Route } from "./+types/admin-dashboard";

type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
};

export async function clientLoader() {
  try {
    const stats = await apiClient.get<DashboardStats>("/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return stats;
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);
    throw new Response("Failed to load dashboard stats", { status: 500 });
  }
}

export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        const response = await apiClient.get<DashboardStats>(
          "/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setStats(response.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        // Fallback to mock data if API fails
        const mockStats: DashboardStats = {
          totalProducts: 156,
          totalOrders: 342,
          totalCustomers: 89,
          totalRevenue: 15420.5,
          recentOrders: [
            {
              id: "ORD-001",
              customerName: "John Doe",
              total: 129.99,
              status: "completed",
              date: "2025-06-23",
            },
            {
              id: "ORD-002",
              customerName: "Jane Smith",
              total: 89.5,
              status: "pending",
              date: "2025-06-23",
            },
            {
              id: "ORD-003",
              customerName: "Mike Johnson",
              total: 199.99,
              status: "processing",
              date: "2025-06-22",
            },
          ],
          topProducts: [
            {
              id: "PROD-001",
              name: "Wireless Headphones",
              sales: 45,
              revenue: 3420.5,
            },
            {
              id: "PROD-002",
              name: "Smart Watch",
              sales: 32,
              revenue: 2890.0,
            },
            {
              id: "PROD-003",
              name: "Laptop Stand",
              sales: 28,
              revenue: 1240.75,
            },
          ],
        };
        setStats(mockStats);
        setError("Using mock data - API connection failed");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "processing":
        return <AlertCircle size={16} className="text-blue-600" />;
      case "shipped":
        return <Truck size={16} className="text-green-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const generateReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      reportType: "Dashboard Statistics",
      summary: {
        totalProducts: stats.totalProducts,
        totalOrders: stats.totalOrders,
        totalCustomers: stats.totalCustomers,
        totalRevenue: stats.totalRevenue,
      },
      recentOrders: stats.recentOrders,
      topProducts: stats.topProducts,
      metadata: {
        reportVersion: "1.0",
        generatedBy: "Admin Dashboard",
        currency: "USD",
      },
    };

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your ecommerce admin panel
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/products/add"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <PlusCircle size={16} className="mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCustomers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/products/add"
            className="group flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-gray-50"
          >
            <PlusCircle className="h-8 w-8 text-gray-400 group-hover:text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                Add Product
              </p>
              <p className="text-sm text-gray-500">Create a new product</p>
            </div>
          </Link>

          <Link
            to="/products/create-attribute-type"
            className="group flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-gray-50"
          >
            <Tag className="h-8 w-8 text-gray-400 group-hover:text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                Create Attribute
              </p>
              <p className="text-sm text-gray-500">Add product attributes</p>
            </div>
          </Link>

          <Link
            to="/suppliers"
            className="group flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-gray-50"
          >
            <Truck className="h-8 w-8 text-gray-400 group-hover:text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                Manage Suppliers
              </p>
              <p className="text-sm text-gray-500">View and edit suppliers</p>
            </div>
          </Link>

          <div className="group flex cursor-pointer items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-gray-50">
            <BarChart3 className="h-8 w-8 text-gray-400 group-hover:text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                View Analytics
              </p>
              <p className="text-sm text-gray-500">
                Sales and performance data
              </p>
            </div>
          </div>

          <button
            onClick={generateReport}
            className="group flex w-full cursor-pointer items-center rounded-lg border border-gray-200 p-4 text-left transition-colors hover:border-indigo-300 hover:bg-gray-50"
          >
            <FileText className="h-8 w-8 text-gray-400 group-hover:text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                Generate Reports
              </p>
              <p className="text-sm text-gray-500">Export sales reports</p>
            </div>
          </button>

          <div className="group flex cursor-pointer items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-indigo-300 hover:bg-gray-50">
            <Settings className="h-8 w-8 text-gray-400 group-hover:text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                System Settings
              </p>
              <p className="text-sm text-gray-500">Configure your store</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              to="/orders"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customerName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${order.total}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Products
            </h2>
            <Link
              to="/products"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                      <span className="text-sm font-medium text-indigo-600">
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${product.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-xs text-green-600">+12%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
