import { Card } from '../components/ui';

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Application settings and configuration
        </p>
      </div>

      <Card>
        <p className="text-center text-secondary-500 py-12">
          Settings page coming soon...
        </p>
      </Card>
    </div>
  );
};
