import { useState } from 'react';
import { Badge, LoadingSpinner } from '../ui';
import type { MachineEvent } from '../../types';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { ArrowUpDown, Eye, Video } from 'lucide-react';

interface EventsTableProps {
  events: MachineEvent[];
  isLoading: boolean;
  onEventClick: (event: MachineEvent) => void;
}

export const EventsTable = ({ events, isLoading, onEventClick }: EventsTableProps) => {
  const [sortField, setSortField] = useState<keyof MachineEvent>('time');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof MachineEvent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined || bValue === undefined) return 0;

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getEventBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case 'stop':
      case 'fault':
        return 'error';
      case 'warning':
        return 'warning';
      case 'normal':
        return 'success';
      default:
        return 'primary';
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <LoadingSpinner className="py-12" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <p className="text-secondary-500 mb-2">No events found</p>
          <p className="text-sm text-secondary-400">Try adjusting your filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('time')}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-secondary-700 dark:text-secondary-300 hover:text-primary-600"
                >
                  Timestamp
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('line')}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-secondary-700 dark:text-secondary-300 hover:text-primary-600"
                >
                  Line
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('camera')}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-secondary-700 dark:text-secondary-300 hover:text-primary-600"
                >
                  Camera
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('event')}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-secondary-700 dark:text-secondary-300 hover:text-primary-600"
                >
                  Event Type
                  <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-700 dark:text-secondary-300">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-secondary-700 dark:text-secondary-300">
                Media
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-secondary-700 dark:text-secondary-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {sortedEvents.map((event, index) => (
              <tr
                key={index}
                className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors cursor-pointer"
                onClick={() => onEventClick(event)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium">{formatDate(event.time)}</div>
                  <div className="text-xs text-secondary-500">
                    {formatRelativeTime(event.time)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium">{event.line}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-secondary-600 dark:text-secondary-400">
                    {event.camera}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getEventBadgeVariant(event.event)}>{event.event}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600 dark:text-secondary-400">
                  {event.duration_seconds ? `${event.duration_seconds}s` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {event.video && (
                      <Video size={16} className="text-primary-600" />
                    )}
                    {event.thumbnail && (
                      <span className="text-xs text-secondary-500">📸</span>
                    )}
                    {!event.video && !event.thumbnail && (
                      <span className="text-xs text-secondary-400">-</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="text-primary-600 hover:text-primary-700"
                    title="View details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
