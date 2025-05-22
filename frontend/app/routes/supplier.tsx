import {
  Calendar,
  DollarSign,
  Inbox,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as api from "~/api/client";
import type { Route } from "./+types/supplier";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { id } = params;
  const supplier = await api.suppliers.getSupplierById(id);
  const statistics = await api.suppliers.getSupplierStatistics(id);

  return { supplier, statistics, topProducts: statistics.topProducts };
}

export default function Supplier({ loaderData }: Route.ComponentProps) {
  const { supplier, statistics, topProducts } = loaderData;
  const loading = false;
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!supplier || !statistics) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>Supplier information not found.</p>
          <Link
            to="/suppliers"
            className="mt-2 inline-block text-indigo-600 hover:underline"
          >
            Return to Suppliers List
          </Link>
        </div>
      </div>
    );
  }

  // Ensure charts only render when data is available
  const renderMonthlyChart = () => {
    if (!statistics?.monthlySales || !statistics?.monthlyRevenue) return null;

    // Prepare monthly data
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyData = monthNames.map((month, index) => ({
      name: month,
      sales: statistics.monthlySales[index],
      revenue: statistics.monthlyRevenue[index],
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" name="Sales" fill="#8884d8" />
          <Bar dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderCategoryChart = () => {
    if (!statistics?.categoryDistribution) return null;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statistics.categoryDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {statistics.categoryDistribution.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="container mx-auto p-6">
      {/* Supplier Header */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">{supplier.name}</h1>
          <Link
            to="/employees/new"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            <span className="mr-2">Add Employee</span>
            <Plus size={18} />
          </Link>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-8">
          <div className="flex items-center text-gray-600">
            <Phone size={18} className="mr-2" />
            <span>{supplier.phoneNumber}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Mail size={18} className="mr-2" />
            <span>{supplier.contactEmail}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin size={18} className="mr-2" />
            <span>{supplier.address}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar size={18} className="mr-2" />
            <span>
              Since {new Date(supplier.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center">
            <div className="mr-3 rounded-full bg-indigo-100 p-3">
              <Inbox size={24} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {statistics.totalOrders.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center">
            <div className="mr-3 rounded-full bg-green-100 p-3">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-800">
                ${statistics.revenue.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center">
            <div className="mr-3 rounded-full bg-blue-100 p-3">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Avg. Order Value
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                ${statistics.averageOrderValue.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="mb-2 flex items-center">
            <div className="mr-3 rounded-full bg-yellow-100 p-3">
              <Package size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Product Categories
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {statistics.categoryDistribution.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {/* Monthly Sales Chart */}
        <div className="col-span-2 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Monthly Performance
          </h2>
          <div className="h-80">{renderMonthlyChart()}</div>
        </div>

        {/* Category Distribution Chart */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Category Distribution
          </h2>
          <div className="h-80">{renderCategoryChart()}</div>
        </div>
      </div>

      {/* Top Products Section */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Top Selling Products
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Last Order
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {topProducts.map((product) => (
                <tr key={product.variant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {product.variant.images && product.variant.images[0] ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={`https://localhost:7215/api${product.variant.images[0].imageUrl}`}
                            alt={product.variant.name}
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://via.placeholder.com/40";
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link
                            to={`/products/${product.variant.id}`}
                            className="text-sm font-medium text-gray-900 hover:underline"
                          >
                            {product.variant.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {product.variant.product.topCategory.name}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    ${product.variant.price}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {product.totalSold}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {new Date(product.lastOrderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
