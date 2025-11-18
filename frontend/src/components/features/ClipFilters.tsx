import { useState } from 'react';
import { Select, Input, Button } from '../ui';
import { Filter, X } from 'lucide-react';

interface ClipFiltersProps {
  cameras: string[];
  onFilterChange: (filters: {
    camera?: string;
    label?: string;
    after?: number;
    before?: number;
  }) => void;
  onReset: () => void;
}

export const ClipFilters = ({ cameras, onFilterChange, onReset }: ClipFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    camera: '',
    label: '',
    timeRange: '24',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const now = Math.floor(Date.now() / 1000);
    const after = value ? now - parseInt(newFilters.timeRange) * 3600 : undefined;

    onFilterChange({
      camera: newFilters.camera || undefined,
      label: newFilters.label || undefined,
      after,
      before: now,
    });
  };

  const handleReset = () => {
    setFilters({
      camera: '',
      label: '',
      timeRange: '24',
    });
    onReset();
  };

  const activeFilterCount = [filters.camera, filters.label].filter(Boolean).length;

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select
          label="Time Range"
          value={filters.timeRange}
          onChange={(e) => handleFilterChange('timeRange', e.target.value)}
          options={[
            { value: '1', label: 'Last Hour' },
            { value: '6', label: 'Last 6 Hours' },
            { value: '24', label: 'Last 24 Hours' },
            { value: '168', label: 'Last 7 Days' },
          ]}
        />
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
          <Select
            label="Camera"
            value={filters.camera}
            onChange={(e) => handleFilterChange('camera', e.target.value)}
            options={[
              { value: '', label: 'All Cameras' },
              ...cameras.map((cam) => ({ value: cam, label: cam })),
            ]}
          />

          <Input
            label="Detection Label"
            placeholder="e.g., person, forklift"
            value={filters.label}
            onChange={(e) => handleFilterChange('label', e.target.value)}
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
