import { Card } from '../components/ui';

export const ClipsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Video Clips</h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Browse recorded video clips from Frigate
        </p>
      </div>

      <Card>
        <p className="text-center text-secondary-500 py-12">
          Clips browser coming soon...
        </p>
      </Card>
    </div>
  );
};
