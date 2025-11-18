import { useEffect, useState } from 'react';
import { Button } from '../components/ui';
import { EventFilters } from '../components/features/EventFilters';
import { EventsTable } from '../components/features/EventsTable';
import { EventDetailModal } from '../components/features/EventDetailModal';
import { Pagination } from '../components/ui/Pagination';
import { useEventsStore } from '../store/eventsStore';
import type { MachineEvent } from '../types';
import { exportToCSV } from '../utils/exportCSV';
import { Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const EventsPage = () => {
  const { events, isLoading, fetchEvents, setFilters, filters } = useEventsStore();
  const [selectedEvent, setSelectedEvent] = useState<MachineEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters, limit: pageSize, offset: 0 });
    setCurrentPage(1);
    fetchEvents({ ...filters, ...newFilters, limit: pageSize, offset: 0 });
  };

  const handleReset = () => {
    setFilters({ limit: pageSize, offset: 0 });
    setCurrentPage(1);
    fetchEvents({ limit: pageSize, offset: 0 });
  };

  const handleRefresh = () => {
    fetchEvents(filters);
    toast.success('Events refreshed');
  };

  const handleExport = () => {
    exportToCSV(events, `events-${new Date().toISOString()}.csv`);
    toast.success(`Exported ${events.length} events to CSV`);
  };

  const handleEventClick = (event: MachineEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const offset = (page - 1) * pageSize;
    fetchEvents({ ...filters, limit: pageSize, offset });
  };

  const totalPages = Math.ceil((events.length || 0) / pageSize);
  const paginatedEvents = events.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Browse and filter machine events from InfluxDB
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport} disabled={events.length === 0}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <EventFilters onFilterChange={handleFilterChange} onReset={handleReset} />

      {/* Events Table */}
      <EventsTable
        events={paginatedEvents}
        isLoading={isLoading}
        onEventClick={handleEventClick}
      />

      {/* Pagination */}
      {events.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          totalItems={events.length}
        />
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
