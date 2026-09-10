"use client";

// FILE PATH: app/admin/page.tsx

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Mock data — swap for real fetches (/api/dashboard or similar) once wired up
// ---------------------------------------------------------------------------

type Stat = {
  label: string;
  value: string;
  delta: number; // percent, +/-
  icon: React.ElementType;
};

const stats: Stat[] = [
  {
    label: "Revenue (30d)",
    value: "₱1,284,300",
    delta: 8.2,
    icon: ShoppingCart,
  },
  { label: "Orders (30d)", value: "142", delta: 4.6, icon: Package },
  { label: "Active projects", value: "23", delta: -2.1, icon: Building2 },
  { label: "Customers", value: "861", delta: 12.4, icon: Users },
];

const revenueTrend = [
  { month: "Mar", revenue: 620000 },
  { month: "Apr", revenue: 710000 },
  { month: "May", revenue: 680000 },
  { month: "Jun", revenue: 890000 },
  { month: "Jul", revenue: 940000 },
  { month: "Aug", revenue: 1050000 },
  { month: "Sep", revenue: 1284300 },
];

const ordersByCategory = [
  { category: "Steel", orders: 48 },
  { category: "Roofing", orders: 36 },
  { category: "Hardware", orders: 27 },
  { category: "Electrical", orders: 19 },
  { category: "Plumbing", orders: 12 },
];

type RecentOrder = {
  id: string;
  customer: string;
  amount: string;
  status: "Pending" | "Processing" | "Fulfilled";
  date: string;
};

const recentOrders: RecentOrder[] = [
  {
    id: "ORD-2291",
    customer: "Concepcion Realty",
    amount: "₱84,500",
    status: "Pending",
    date: "Sep 7",
  },
  {
    id: "ORD-2290",
    customer: "St. Luke's Builders",
    amount: "₱212,000",
    status: "Processing",
    date: "Sep 7",
  },
  {
    id: "ORD-2289",
    customer: "Villar Construction",
    amount: "₱36,750",
    status: "Fulfilled",
    date: "Sep 6",
  },
  {
    id: "ORD-2288",
    customer: "Metro Steel Works",
    amount: "₱158,900",
    status: "Fulfilled",
    date: "Sep 5",
  },
  {
    id: "ORD-2287",
    customer: "J. Reyes Hardware",
    amount: "₱19,200",
    status: "Fulfilled",
    date: "Sep 5",
  },
];

const topProducts = [
  { name: "G.I. Sheet 0.4mm", units: 312, share: 0.86 },
  { name: "Rebar 10mm x 6m", units: 268, share: 0.74 },
  { name: 'Roofing Nails 2"', units: 201, share: 0.55 },
  { name: "C-Purlins 2x4", units: 154, share: 0.42 },
];

// ---------------------------------------------------------------------------

function StatCard({ label, value, delta, icon: Icon }: Stat) {
  const positive = delta >= 0;
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-steel-light">{label}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-blue-900">
            {value}
          </p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
          <Icon className="size-4.5" />
        </div>
      </div>
      <div
        className={cn(
          "mt-3 inline-flex items-center gap-1 text-xs font-medium",
          positive ? "text-emerald-600" : "text-red-600",
        )}
      >
        {positive ? (
          <ArrowUpRight className="size-3.5" />
        ) : (
          <ArrowDownRight className="size-3.5" />
        )}
        {Math.abs(delta)}% vs last month
      </div>
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-base font-semibold text-blue-900">
            Revenue
          </h2>
          <p className="text-sm text-steel-light">Last 7 months</p>
        </div>
      </div>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueTrend} margin={{ left: -12, right: 8 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#e5edf5" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
              width={56}
            />
            <Tooltip
              formatter={(value) => [
                `₱${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
              contentStyle={{
                borderRadius: 8,
                borderColor: "#dbeafe",
                fontSize: 13,
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#revenueFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function OrdersByCategoryChart() {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-5">
      <h2 className="font-display text-base font-semibold text-blue-900">
        Orders by category
      </h2>
      <p className="text-sm text-steel-light">Last 30 days</p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ordersByCategory} margin={{ left: -12, right: 8 }}>
            <CartesianGrid vertical={false} stroke="#e5edf5" />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              width={28}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                borderColor: "#dbeafe",
                fontSize: 13,
              }}
            />
            <Bar dataKey="orders" fill="#065f46" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TopProducts() {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-5">
      <h2 className="font-display text-base font-semibold text-blue-900">
        Top products
      </h2>
      <p className="text-sm text-steel-light">By units sold, last 30 days</p>
      <ul className="mt-4 space-y-4">
        {topProducts.map((p) => (
          <li key={p.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-blue-900">{p.name}</span>
              <span className="text-steel-light">{p.units} units</span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{ width: `${p.share * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function statusStyles(status: RecentOrder["status"]) {
  switch (status) {
    case "Fulfilled":
      return "bg-emerald-50 text-emerald-700";
    case "Processing":
      return "bg-orange-50 text-orange-700";
    case "Pending":
      return "bg-slate-100 text-steel";
  }
}

function RecentOrdersTable() {
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-blue-900">
          Recent orders
        </h2>
        <a
          href="/admin/orders"
          className="text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          View all
        </a>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-blue-100 text-xs text-steel-light">
              <th className="pb-2 font-medium">Order</th>
              <th className="pb-2 font-medium">Customer</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="py-2.5 font-medium text-blue-900">{order.id}</td>
                <td className="py-2.5 text-steel">{order.customer}</td>
                <td className="py-2.5 text-steel">{order.amount}</td>
                <td className="py-2.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      statusStyles(order.status),
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-2.5 text-steel-light">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="p-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-blue-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-steel">
          Overview of orders, revenue, and activity across IMC.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <TopProducts />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <OrdersByCategoryChart />
        </div>
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
      </div>
    </div>
  );
}
