import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/hooks';
import { dashboardAPI } from '../services/api';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import {
  TrendingUp,
  Receipt,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/helpers';

// Chart palette
const CHART_COLORS = [
  '#EF4444', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981',
  '#EC4899', '#6B7280', '#DC2626', '#059669', '#7C3AED',
];

// Tooltip renderer
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Dashboard page
const Dashboard = () => {
  // State & actions
  const { dashboardData, loading, setDashboardData, setLoading, setError } = useDashboard();

  // Date range
  const [dateRange, setDateRange] = useState({
    start_date: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    end_date: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  // Fetch on date change
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  // API: dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardAPI.getData(dateRange);
      setDashboardData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // UI helpers
  const handleDateRangeChange = (field, value) =>
    setDateRange((prev) => ({ ...prev, [field]: value }));

  const getGrowthIcon = (g) =>
    g > 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> :
    g < 0 ? <ArrowDownRight className="w-4 h-4 text-red-500" /> : null;

  const getGrowthColor = (g) =>
    g > 0 ? 'text-green-600' : g < 0 ? 'text-red-600' : 'text-gray-600';

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  // Render
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your expenses and spending patterns</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <input
            type="date"
            value={dateRange.start_date}
            onChange={(e) => handleDateRangeChange('start_date', e.target.value)}
            className="input text-sm"
            max={dateRange.end_date}
          />
          <input
            type="date"
            value={dateRange.end_date}
            onChange={(e) => handleDateRangeChange('end_date', e.target.value)}
            className="input text-sm"
            min={dateRange.start_date}
          />
        </div>
      </div>

      {dashboardData ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(dashboardData.summary?.total_expenses || 0)}
                    </p>
                    {dashboardData.summary?.monthly_growth !== undefined && (
                      <div className={`flex items-center mt-1 text-sm ${getGrowthColor(dashboardData.summary.monthly_growth)}`}>
                        {getGrowthIcon(dashboardData.summary.monthly_growth)}
                        <span className="ml-1">
                          {Math.abs(dashboardData.summary.monthly_growth).toFixed(1)}% from last month
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.summary?.total_count || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Total expense entries</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Receipt className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Daily Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(dashboardData.summary?.average_per_day || 0)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Per day in period</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.category_breakdown?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Active categories</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full">
                    <PieChart className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Daily Expenses Trend */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Daily Expenses Trend</h2>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="card-body">
                {dashboardData.daily_expenses && dashboardData.daily_expenses.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.daily_expenses}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="date"
                          stroke="#6b7280"
                          fontSize={12}
                          tickFormatter={(v) => format(new Date(v), 'MMM dd')}
                        />
                        <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No expense data available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Category Breakdown</h2>
                  <PieChart className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="card-body">
                {dashboardData.category_breakdown && dashboardData.category_breakdown.length > 0 ? (
                  <>
                    <div className="h-64 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={dashboardData.category_breakdown}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="total_amount"
                            nameKey="category.name"
                          >
                            {dashboardData.category_breakdown.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-3">
                      {dashboardData.category_breakdown.map((c, i) => {
                        const total = dashboardData.summary?.total_expenses || 0;
                        const pct = total > 0 ? ((c.total_amount / total) * 100).toFixed(1) : 0;
                        return (
                          <div key={c.category.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                              />
                              <span className="text-sm font-medium text-gray-900">{c.category.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-gray-900">
                                {formatCurrency(c.total_amount)}
                              </span>
                              <div className="text-xs text-gray-500">{pct}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No category data available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Expenses & Top Categories */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Expenses */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
                  <Receipt className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="card-body">
                {dashboardData.recent_expenses && dashboardData.recent_expenses.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recent_expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: expense.category.color }}
                          />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{expense.title}</p>
                            <p className="text-xs text-gray-500">{expense.category.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm">
                            {formatCurrency(expense.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(expense.expense_date, 'MMM dd')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Receipt className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No recent expenses</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Categories */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Top Categories (All Time)</h2>
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="card-body">
                {dashboardData.top_categories && dashboardData.top_categories.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.top_categories.map((c, i) => (
                      <div key={c.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                            {i + 1}
                          </div>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.expense_count} expenses</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 text-sm">
                            {formatCurrency(c.total_spent)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No category data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Period Summary */}
          {dashboardData.period_info && (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-semibold text-gray-900">Period Summary</h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {dashboardData.period_info.days_in_period}
                    </p>
                    <p className="text-sm text-gray-600">Days in Period</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(dashboardData.period_info.current_month_total)}
                    </p>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">
                      {formatCurrency(dashboardData.period_info.previous_month_total)}
                    </p>
                    <p className="text-sm text-gray-600">Last Month</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">No Data Available</h2>
            <p>Start by adding some expenses to see your dashboard.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
