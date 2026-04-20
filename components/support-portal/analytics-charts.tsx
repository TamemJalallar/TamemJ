"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface ChartRow {
  name: string;
  value: number;
  color?: string;
}

interface AnalyticsChartsProps {
  kbViewsRows: ChartRow[];
  searchRows: ChartRow[];
  productRows: ChartRow[];
  priorityRows: ChartRow[];
  helpfulData: ChartRow[];
  categoryRows: ChartRow[];
}

function ChartCard({
  title,
  children,
  emptyMessage,
  hasData
}: {
  title: string;
  children: ReactNode;
  emptyMessage: string;
  hasData: boolean;
}) {
  return (
    <section className="rounded-2xl border border-line/70 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950/70 sm:p-6">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      {hasData ? (
        <div className="mt-4 h-[260px]">{children}</div>
      ) : (
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{emptyMessage}</p>
      )}
    </section>
  );
}

export function AnalyticsCharts({
  kbViewsRows,
  searchRows,
  productRows,
  priorityRows,
  helpfulData,
  categoryRows
}: AnalyticsChartsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <ChartCard
        title="Most Viewed Tickets"
        emptyMessage="No ticket views tracked yet. Open tickets to populate this chart."
        hasData={kbViewsRows.length > 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={kbViewsRows}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Views" fill="#0f172a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Most Searched Issues"
        emptyMessage="No search queries tracked yet. Use search across the portal to populate results."
        hasData={searchRows.length > 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={searchRows}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="Searches" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Top Products Causing Issues / Requests"
        emptyMessage="No product-level activity tracked yet."
        hasData={productRows.length > 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={productRows} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip />
            <Bar dataKey="value" name="Events" fill="#4f46e5" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Incidents by Priority"
        emptyMessage="No incident tickets have been recorded yet."
        hasData={priorityRows.length > 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={priorityRows}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" name="Incidents" fill="#dc2626" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Helpful vs Not Helpful Ratio"
        emptyMessage="No helpfulness votes tracked yet."
        hasData={helpfulData.length > 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={helpfulData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
              {helpfulData.map((entry) => (
                <Cell key={entry.name} fill={entry.color ?? "#2563eb"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Most Selected Categories"
        emptyMessage="No category activity recorded yet."
        hasData={categoryRows.length > 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryRows}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="name" hide />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" name="Selections" fill="#0891b2" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
