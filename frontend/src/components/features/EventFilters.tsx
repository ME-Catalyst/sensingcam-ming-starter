import { useState } from 'react';
import { Select, Input, Button } from '../ui';
import { TIME_RANGES, EVENT_TYPES } from '../../constants';
import { Filter, X } from 'lucide-react';

interface EventFiltersProps {
  onFilterChange: (filters: {
    start?: string;
    end?: string;
    line?: string;
    camera?: string;
    event?: string;
  }) => void;
  onReset: () => void;
}

export const EventFilters = ({ onFilterChange, onReset }: EventFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: '-24h',
    line: '',
    camera: '',
    event: '',
  });

  const handleTimeRangeChange = (value: string) => {
    setFilters({ ...filters, timeRange: value });
    onFilterChange({ start: value, end: 'now()' });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    onFilterChange({
      start: newFilters.timeRange,
      end: 'now()',
      line: newFilters.line || undefined,
      camera: newFilters.camera || undefined,
      event: newFilters.event || undefined,
    });
  };

  const handleReset = () => {
    setFilters({
      timeRange: '-24h',
      line: '',
      camera: '',
      event: '',
    });
    onReset();
  };

  const activeFilterCount = [filters.line, filters.camera, filters.event].filter(Boolean).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-primary-600" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="badge badge-primary">{activeFilterCount} active</span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          {isExpanded ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Time Range"
          value={filters.timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          options={[
            { value: '', label: 'Select time range' },
            ...TIME_RANGES.map((r) => ({ value: r.value, label: r.label })),
          ]}
        />
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <Input
            label="Production Line"
            placeholder="e.g., assembly_1"
            value={filters.line}
            onChange={(e) => handleFilterChange('line', e.target.value)}
          />

          <Input
            label="Camera"
            placeholder="e.g., sensingcam"
            value={filters.camera}
            onChange={(e) => handleFilterChange('camera', e.target.value)}
          />

          <Select
            label="Event Type"
            value={filters.event}
            onChange={(e) => handleFilterChange('event', e.target.value)}
            options={[
              { value: '', label: 'All Events' },
              ...EVENT_TYPES.map((type) => ({ value: type, label: type })),
            ]}
          />

          <div className="flex items-end">
            <Button variant="secondary" onClick={handleReset} className="w-full">
              <X size={16} className="mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
