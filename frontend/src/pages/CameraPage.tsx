import { useEffect, useState } from 'react';
import { Card, Button, Badge, LoadingSpinner } from '../components/ui';
import { LiveStream } from '../components/features/LiveStream';
import { MultiCameraGrid } from '../components/features/MultiCameraGrid';
import { useCameraStore } from '../store/cameraStore';
import { useFrigateStore } from '../store/frigateStore';
import { Play, Square, RefreshCw, Camera as CameraIcon, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export const CameraPage = () => {
  const {
    status,
    isRecording,
    isLoading,
    fetchStatus,
    fetchStreamUrl,
    startRecording,
    stopRecording,
  } = useCameraStore();
  const { cameras, fetchCameras } = useFrigateStore();
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');
  const [recordingDuration, setRecordingDuration] = useState(30);

  useEffect(() => {
    fetchStatus();
    fetchStreamUrl();
    fetchCameras();
  }, []);

  const handleStartRecording = async () => {
    try {
      await startRecording({ duration: recordingDuration, pre_roll: 5, post_roll: 5 });
      toast.success(`Recording started (${recordingDuration}s)`);
    } catch (error) {
      toast.error('Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopRecording();
      toast.success('Recording stopped');
    } catch (error) {
      toast.error('Failed to stop recording');
    }
  };

  const handleRefreshStatus = () => {
    fetchStatus();
    toast.success('Status refreshed');
  };

  // Create camera array for multi-view
  const multiCameras = cameras.map((cam) => ({
    id: cam,
    name: cam,
    streamUrl: `http://localhost:8554/${cam}`, // Frigate RTSP restream
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Camera Control</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Live camera streams and recording controls
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleRefreshStatus}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Camera Status */}
      <Card title="Camera Status">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <CameraIcon size={24} className="text-primary-600" />
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Status</p>
                <p className="font-semibold mt-1">
                  {status?.online ? (
                    <Badge variant="success">Online</Badge>
                  ) : (
                    <Badge variant="error">Offline</Badge>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Info size={24} className="text-primary-600" />
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Host</p>
                <p className="font-semibold mt-1">{status?.host || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isRecording ? (
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              ) : (
                <div className="w-3 h-3 bg-secondary-300 dark:bg-secondary-700 rounded-full"></div>
              )}
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Recording</p>
                <p className="font-semibold mt-1">
                  {isRecording ? (
                    <Badge variant="error">Active</Badge>
                  ) : (
                    <Badge variant="primary">Idle</Badge>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Recording Controls */}
      <Card title="Recording Controls">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Duration (seconds):</label>
            <input
              type="number"
              value={recordingDuration}
              onChange={(e) => setRecordingDuration(parseInt(e.target.value))}
              min={10}
              max={300}
              className="w-24 px-3 py-2 border rounded-lg bg-white dark:bg-secondary-800"
            />
          </div>

          {!isRecording ? (
            <Button onClick={handleStartRecording} disabled={!status?.online}>
              <Play size={16} className="mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button variant="danger" onClick={handleStopRecording}>
              <Square size={16} className="mr-2" />
              Stop Recording
            </Button>
          )}
        </div>

        <div className="mt-4 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            <strong>Note:</strong> Recording will include 5s pre-roll and 5s post-roll
          </p>
        </div>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('single')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'single'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 dark:bg-secondary-800'
          }`}
        >
          Single Camera
        </button>
        <button
          onClick={() => setViewMode('multi')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'multi'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 dark:bg-secondary-800'
          }`}
        >
          Multi-Camera Grid
        </button>
      </div>

      {/* Live Stream */}
      {viewMode === 'single' ? (
        <Card title="Live Stream">
          {status?.stream_url ? (
            <LiveStream streamUrl={status.stream_url} cameraName="sensingCam" />
          ) : (
            <div className="text-center py-12 text-secondary-500">
              <p>Stream URL not available</p>
              <p className="text-sm mt-2">Camera may be offline</p>
            </div>
          )}
        </Card>
      ) : (
        <Card title="Multi-Camera View">
          <MultiCameraGrid cameras={multiCameras} />
        </Card>
      )}
    </div>
  );
};
