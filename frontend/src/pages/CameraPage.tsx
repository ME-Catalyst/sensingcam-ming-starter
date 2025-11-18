import { Card } from '../components/ui';

export const CameraPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Camera Control</h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Control camera settings and recordings
        </p>
      </div>

      <Card>
        <p className="text-center text-secondary-500 py-12">
          Camera controls coming soon...
        </p>
      </Card>
    </div>
  );
};
