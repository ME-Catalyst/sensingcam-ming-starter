import type { FrigateClip } from '../../types';
import { formatDate } from '../../utils/formatters';
import { Video, Download } from 'lucide-react';

interface ClipCardProps {
  clip: FrigateClip;
  onPlay: (clip: FrigateClip) => void;
  onDownload: (clip: FrigateClip) => void;
  thumbnailUrl?: string;
}

export const ClipCard = ({ clip, onPlay, onDownload, thumbnailUrl }: ClipCardProps) => {
  const duration = clip.end_time - clip.start_time;

  return (
    <div className="card p-0 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
      {/* Thumbnail */}
      <div
        className="relative aspect-video bg-secondary-900 overflow-hidden"
        onClick={() => onPlay(clip)}
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Clip from ${clip.camera}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Video size={48} className="text-secondary-500" />
          </div>
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Video size={32} className="text-white ml-1" />
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {Math.floor(duration)}s
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{clip.camera}</h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              {formatDate(new Date(clip.start_time * 1000).toISOString())}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {clip.has_clip && (
                <span className="inline-flex items-center gap-1 text-xs text-secondary-600 dark:text-secondary-400">
                  <Video size={12} />
                  Clip
                </span>
              )}
              {clip.has_snapshot && (
                <span className="text-xs text-secondary-600 dark:text-secondary-400">
                  📸 Snapshot
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload(clip);
            }}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
            title="Download"
          >
            <Download size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
