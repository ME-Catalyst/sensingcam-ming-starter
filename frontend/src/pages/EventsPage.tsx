import { Card } from '../components/ui';

export const EventsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Events</h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Browse and filter machine events
        </p>
      </div>

      <Card>
        <p className="text-center text-secondary-500 py-12">
          Events page coming soon...
        </p>
      </Card>
    </div>
  );
};
