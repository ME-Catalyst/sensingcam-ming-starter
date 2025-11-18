import { useEffect, useState } from 'react';
import { Card, Button, Badge, LoadingSpinner } from '../components/ui';
import { useEventsStore } from '../store/eventsStore';
import type { MachineEvent } from '../types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, TrendingUp, Activity, Download } from 'lucide-react';
import { exportToCSV } from '../utils/exportCSV';

type TimeRange = '24h' | '7d' | '30d';

interface EventAnalytics {
  byHour: { hour: string; count: number }[];
  byDay: { day: string; count: number }[];
  byLine: { line: string; count: number }[];
  byType: { type: string; count: number; percentage: number }[];
  total: number;
  uniqueLines: number;
  avgPerDay: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const AnalyticsPage = () => {
  const { events, isLoading, fetchEvents } = useEventsStore();
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null);

  useEffect(() => {
    const now = new Date();
    const start = new Date();

    switch (timeRange) {
      case '24h':
        start.setHours(now.getHours() - 24);
        break;
      case '7d':
        start.setDate(now.getDate() - 7);
        break;
      case '30d':
        start.setDate(now.getDate() - 30);
        break;
    }

    fetchEvents({
      start: start.toISOString(),
      end: now.toISOString(),
    });
  }, [timeRange, fetchEvents]);

  useEffect(() => {
    if (events.length > 0) {
      calculateAnalytics(events);
    }
  }, [events]);

  const calculateAnalytics = (eventData: MachineEvent[]) => {
    // By hour (0-23)
    const hourCounts: Record<number, number> = {};
    for (let i = 0; i < 24; i++) hourCounts[i] = 0;

    // By day
    const dayCounts: Record<string, number> = {};

    // By line
    const lineCounts: Record<string, number> = {};

    // By type
    const typeCounts: Record<string, number> = {};

    eventData.forEach((event) => {
      const date = new Date(event.time);
      const hour = date.getHours();
      const day = date.toISOString().split('T')[0];

      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      dayCounts[day] = (dayCounts[day] || 0) + 1;
      lineCounts[event.line] = (lineCounts[event.line] || 0) + 1;
      typeCounts[event.event] = (typeCounts[event.event] || 0) + 1;
    });

    const byHour = Object.entries(hourCounts).map(([hour, count]) => ({
      hour: `${hour.padStart(2, '0')}:00`,
      count,
    }));

    const byDay = Object.entries(dayCounts)
      .map(([day, count]) => ({
        day: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count,
      }))
      .slice(-30);

    const byLine = Object.entries(lineCounts)
      .map(([line, count]) => ({ line, count }))
      .sort((a, b) => b.count - a.count);

    const total = eventData.length;
    const byType = Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / total) * 100),
    }));

    const uniqueDays = Object.keys(dayCounts).length;
    const avgPerDay = uniqueDays > 0 ? Math.round(total / uniqueDays) : 0;

    setAnalytics({
      byHour,
      byDay,
      byLine,
      byType,
      total,
      uniqueLines: Object.keys(lineCounts).length,
      avgPerDay,
    });
  };

  const handleExportData = () => {
    exportToCSV(events, `analytics-${timeRange}-${Date.now()}.csv`);
  };

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Event analytics and statistics
          </p>
        </div>

        <Button onClick={handleExportData} disabled={events.length === 0}>
          <Download size={16} className="mr-2" />
          Export Data
        </Button>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {timeRanges.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTimeRange(value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === value
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Card>
          <LoadingSpinner className="py-12" />
        </Card>
      ) : !analytics ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-secondary-500">No data available</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                  <Activity size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Events</p>
                  <p className="text-2xl font-bold mt-1">{analytics.total.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Event Types</p>
                  <p className="text-2xl font-bold mt-1">{analytics.byType.length}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Activity size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Production Lines</p>
                  <p className="text-2xl font-bold mt-1">{analytics.uniqueLines}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Calendar size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Avg Per Day</p>
                  <p className="text-2xl font-bold mt-1">{analytics.avgPerDay}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events Over Time */}
            <Card title="Events Over Time">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.byDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-secondary-200 dark:stroke-secondary-700" />
                  <XAxis
                    dataKey="day"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Events"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Events by Hour */}
            <Card title="Events by Hour">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.byHour}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-secondary-200 dark:stroke-secondary-700" />
                  <XAxis
                    dataKey="hour"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#10b981" name="Events" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Events by Production Line */}
            <Card title="Events by Production Line">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.byLine.slice(0, 10)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-secondary-200 dark:stroke-secondary-700" />
                  <XAxis type="number" className="text-xs" tick={{ fill: 'currentColor' }} />
                  <YAxis
                    dataKey="line"
                    type="category"
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#8b5cf6" name="Events" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Events by Type */}
            <Card title="Events by Type">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.byType}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry: any) => `${entry.type} (${entry.percentage}%)`}
                  >
                    {analytics.byType.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg)',
                      border: '1px solid var(--tooltip-border)',
                      borderRadius: '0.5rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top Production Lines */}
          <Card title="Top Production Lines">
            <div className="space-y-4">
              {analytics.byLine.slice(0, 5).map((item, index) => {
                const percentage = Math.round((item.count / analytics.total) * 100);
                return (
                  <div key={item.line} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="primary">#{index + 1}</Badge>
                        <span className="font-medium">{item.line}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{item.count}</span>
                        <span className="text-sm text-secondary-500 ml-2">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
