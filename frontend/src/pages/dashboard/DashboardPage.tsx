import { useEffect } from 'react';
import { Card, Badge, LoadingSpinner } from '../../components/ui';
import { useEventsStore } from '../../store/eventsStore';
import { useCameraStore } from '../../store/cameraStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatRelativeTime } from '../../utils/formatters';
import { Activity, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const { events, statistics, fetchEvents, fetchStatistics, isLoading } = useEventsStore();
  const { status, fetchStatus } = useCameraStore();
  const { onFactoryEvent, onFrigateEvent } = useWebSocket();

  useEffect(() => {
    fetchEvents({ limit: 10 });
    fetchStatistics('-24h', 'now()');
    fetchStatus();

    const unsubFactory = onFactoryEvent((event) => {
      toast(`Factory Event: ${event.event} on ${event.line}`, {
        icon: '🏭',
      });
      fetchEvents({ limit: 10 });
    });

    const unsubFrigate = onFrigateEvent((event) => {
      toast(`Detection: ${event.label} on ${event.camera}`, {
        icon: '🎥',
      });
    });

    return () => {
      unsubFactory();
      unsubFrigate();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Real-time camera monitoring and event tracking
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Events</p>
              <p className="text-2xl font-bold mt-1">
                {statistics?.totalEvents || 0}
              </p>
              <p className="text-xs text-secondary-500 mt-1">Last 24 hours</p>
            </div>
            <Activity className="text-primary-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Camera Status</p>
              <p className="text-2xl font-bold mt-1">
                {status?.online ? (
                  <span className="text-success flex items-center gap-2">
                    <CheckCircle size={24} /> Online
                  </span>
                ) : (
                  <span className="text-error flex items-center gap-2">
                    <AlertCircle size={24} /> Offline
                  </span>
                )}
              </p>
            </div>
            <Camera className="text-primary-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Recent Events</p>
              <p className="text-2xl font-bold mt-1">{events.length}</p>
              <p className="text-xs text-secondary-500 mt-1">Last 10 events</p>
            </div>
            <AlertCircle className="text-warning" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Host</p>
              <p className="text-lg font-bold mt-1">{status?.host || 'N/A'}</p>
              <p className="text-xs text-secondary-500 mt-1">Camera address</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Events */}
      <Card title="Recent Events">
        {isLoading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <p className="text-center text-secondary-500 py-8">No events found</p>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant={event.event === 'stop' ? 'error' : 'primary'}>
                      {event.event}
                    </Badge>
                    <span className="font-medium">{event.line}</span>
                    <span className="text-sm text-secondary-500">{event.camera}</span>
                  </div>
                  {event.video && (
                    <p className="text-xs text-secondary-500 mt-1">
                      Video: {event.video}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    {formatRelativeTime(event.time)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
