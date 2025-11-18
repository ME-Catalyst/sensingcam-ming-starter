import { Card } from '../components/ui';

export const AnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Event analytics and statistics
        </p>
      </div>

      <Card>
        <p className="text-center text-secondary-500 py-12">
          Analytics dashboard coming soon...
        </p>
      </Card>
    </div>
  );
};
