import type { MachineEvent } from '../types';

export const exportToCSV = (events: MachineEvent[], filename: string = 'events.csv') => {
  if (events.length === 0) {
    return;
  }

  // Headers
  const headers = ['Timestamp', 'Line', 'Camera', 'Event Type', 'Duration (s)', 'Video', 'Thumbnail'];

  // Convert events to CSV rows
  const rows = events.map((event) => [
    event.time,
    event.line,
    event.camera,
    event.event,
    event.duration_seconds?.toString() || '',
    event.video || '',
    event.thumbnail || '',
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
