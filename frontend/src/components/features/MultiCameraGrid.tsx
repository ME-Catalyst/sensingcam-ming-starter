import { useState } from 'react';
import { LiveStream } from './LiveStream';
import { Grid2X2, Grid3X3, Maximize2 } from 'lucide-react';

interface Camera {
  id: string;
  name: string;
  streamUrl: string;
}

interface MultiCameraGridProps {
  cameras: Camera[];
}

export const MultiCameraGrid = ({ cameras }: MultiCameraGridProps) => {
  const [layout, setLayout] = useState<'1x1' | '2x2' | '3x3'>('2x2');
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  const gridClasses = {
    '1x1': 'grid-cols-1',
    '2x2': 'grid-cols-1 md:grid-cols-2',
    '3x3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  const visibleCameras = selectedCamera
    ? cameras.filter((cam) => cam.id === selectedCamera)
    : cameras;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {!selectedCamera && (
            <>
              <button
                onClick={() => setLayout('1x1')}
                className={`p-2 rounded-lg ${
                  layout === '1x1'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                }`}
                title="1x1 Grid"
              >
                <Maximize2 size={20} />
              </button>
              <button
                onClick={() => setLayout('2x2')}
                className={`p-2 rounded-lg ${
                  layout === '2x2'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                }`}
                title="2x2 Grid"
              >
                <Grid2X2 size={20} />
              </button>
              <button
                onClick={() => setLayout('3x3')}
                className={`p-2 rounded-lg ${
                  layout === '3x3'
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                }`}
                title="3x3 Grid"
              >
                <Grid3X3 size={20} />
              </button>
            </>
          )}
        </div>

        {selectedCamera && (
          <button
            onClick={() => setSelectedCamera(null)}
            className="px-4 py-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-700"
          >
            Show All Cameras
          </button>
        )}
      </div>

      {/* Camera Grid */}
      <div className={`grid ${gridClasses[layout]} gap-4`}>
        {visibleCameras.map((camera) => (
          <div
            key={camera.id}
            className="cursor-pointer"
            onClick={() => !selectedCamera && setSelectedCamera(camera.id)}
          >
            <LiveStream
              streamUrl={camera.streamUrl}
              cameraName={camera.name}
              showControls={selectedCamera === camera.id}
            />
          </div>
        ))}
      </div>

      {cameras.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-secondary-500">No cameras available</p>
        </div>
      )}
    </div>
  );
};
