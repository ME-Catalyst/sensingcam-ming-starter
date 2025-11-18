import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Maximize, Volume2, VolumeX, RefreshCw } from 'lucide-react';

interface LiveStreamProps {
  streamUrl: string;
  cameraName: string;
  showControls?: boolean;
}

export const LiveStream = ({ streamUrl, cameraName, showControls = true }: LiveStreamProps) => {
  const [muted, setMuted] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [error, setError] = useState(false);
  const playerRef = useRef<any>(null);

  const handleFullscreen = () => {
    const playerElement = playerRef.current?.wrapper;
    if (playerElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        playerElement.requestFullscreen();
      }
    }
  };

  const handleReload = () => {
    setError(false);
    setIsLive(false);
    setTimeout(() => setIsLive(true), 100);
  };

  const handleError = () => {
    setError(true);
    setIsLive(false);
  };

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {showControls && (
        <div className="bg-secondary-900 px-4 py-2 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{cameraName}</span>
          </div>
          <span className="text-xs text-secondary-400">LIVE</span>
        </div>
      )}

      <div className="relative aspect-video bg-black">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <p className="mb-4">Failed to load stream</p>
            <button
              onClick={handleReload}
              className="px-4 py-2 bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <RefreshCw size={16} className="inline mr-2" />
              Retry
            </button>
          </div>
        ) : isLive ? (
          <ReactPlayer
            // @ts-ignore
            ref={playerRef}
            url={streamUrl}
            playing
            muted={muted}
            width="100%"
            height="100%"
            onError={handleError}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>

      {showControls && (
        <div className="bg-secondary-900 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 hover:bg-secondary-800 rounded-lg transition-colors text-white"
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <button
              onClick={handleReload}
              className="p-2 hover:bg-secondary-800 rounded-lg transition-colors text-white"
              title="Reload stream"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <button
            onClick={handleFullscreen}
            className="p-2 hover:bg-secondary-800 rounded-lg transition-colors text-white"
            title="Fullscreen"
          >
            <Maximize size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
