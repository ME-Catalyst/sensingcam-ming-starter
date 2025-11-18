import { Modal, Badge } from '../ui';
import { MachineEvent } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Calendar, Camera, Activity, Video, Clock } from 'lucide-react';

interface EventDetailModalProps {
  event: MachineEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailModal = ({ event, isOpen, onClose }: EventDetailModalProps) => {
  if (!event) return null;

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Details" size="lg">
      <div className="space-y-6">
        {/* Event Type Badge */}
        <div className="flex items-center gap-3">
          <Activity size={24} className="text-primary-600" />
          <div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">Event Type</p>
            <Badge variant={getEventBadgeVariant(event.event)} className="mt-1 text-base">
              {event.event}
            </Badge>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timestamp */}
          <div className="flex items-start gap-3">
            <Calendar size={20} className="text-secondary-500 mt-1" />
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Timestamp</p>
              <p className="font-medium mt-1">{formatDate(event.time)}</p>
            </div>
          </div>

          {/* Production Line */}
          <div className="flex items-start gap-3">
            <Activity size={20} className="text-secondary-500 mt-1" />
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Production Line</p>
              <p className="font-medium mt-1">{event.line}</p>
            </div>
          </div>

          {/* Camera */}
          <div className="flex items-start gap-3">
            <Camera size={20} className="text-secondary-500 mt-1" />
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Camera</p>
              <p className="font-medium mt-1">{event.camera}</p>
            </div>
          </div>

          {/* Duration */}
          {event.duration_seconds && (
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-secondary-500 mt-1" />
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Duration</p>
                <p className="font-medium mt-1">{event.duration_seconds} seconds</p>
              </div>
            </div>
          )}
        </div>

        {/* Media Section */}
        {(event.video || event.thumbnail) && (
          <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Video size={20} className="text-primary-600" />
              <h4 className="font-semibold">Media</h4>
            </div>

            <div className="space-y-3">
              {event.video && (
                <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Video size={18} className="text-primary-600" />
                    <div>
                      <p className="text-sm font-medium">Video Recording</p>
                      <p className="text-xs text-secondary-500">{event.video}</p>
                    </div>
                  </div>
                  <a
                    href={event.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View
                  </a>
                </div>
              )}

              {event.thumbnail && (
                <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📸</span>
                    <div>
                      <p className="text-sm font-medium">Thumbnail</p>
                      <p className="text-xs text-secondary-500">{event.thumbnail}</p>
                    </div>
                  </div>
                  <a
                    href={event.thumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    View
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Raw Data */}
        <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
          <h4 className="font-semibold mb-3">Raw Event Data</h4>
          <pre className="bg-secondary-50 dark:bg-secondary-900 p-4 rounded-lg text-xs overflow-x-auto">
            {JSON.stringify(event, null, 2)}
          </pre>
        </div>
      </div>
    </Modal>
  );
};
