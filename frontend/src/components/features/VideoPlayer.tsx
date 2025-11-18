import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, Download } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title?: string;
  onDownload?: () => void;
}

export const VideoPlayer = ({ url, title, onDownload }: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef<any>(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPlayed(value);
    playerRef.current?.seekTo(value);
  };

  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played);
  };

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

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {title && (
        <div className="bg-secondary-900 px-4 py-2 text-white text-sm font-medium">
          {title}
        </div>
      )}

      <div className="relative aspect-video bg-black">
        {/* @ts-ignore - ReactPlayer types issue */}
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          muted={muted}
          volume={volume}
          playbackRate={playbackRate}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          progressInterval={100}
        />
      </div>

      <div className="bg-secondary-900 p-4 space-y-3">
        {/* Progress Bar */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={played}
          onChange={handleSeek}
          className="w-full h-1 bg-secondary-700 rounded-lg appearance-none cursor-pointer slider"
        />

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="p-2 hover:bg-secondary-800 rounded-lg transition-colors text-white"
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="p-2 hover:bg-secondary-800 rounded-lg transition-colors text-white"
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={muted ? 0 : volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  setMuted(false);
                }}
                className="w-20 h-1 bg-secondary-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Playback Speed */}
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-secondary-800 text-white px-2 py-1 rounded text-sm cursor-pointer"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Download */}
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 hover:bg-secondary-800 rounded-lg transition-colors text-white"
                title="Download"
              >
                <Download size={20} />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-secondary-800 rounded-lg transition-colors text-white"
              title="Fullscreen"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: none;
        }
      `}</style>
    </div>
  );
};
