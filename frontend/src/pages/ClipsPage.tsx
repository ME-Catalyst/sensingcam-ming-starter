import { useEffect, useState } from 'react';
import { Button, LoadingSpinner, Modal } from '../components/ui';
import { ClipFilters } from '../components/features/ClipFilters';
import { ClipCard } from '../components/features/ClipCard';
import { VideoPlayer } from '../components/features/VideoPlayer';
import { useFrigateStore } from '../store/frigateStore';
import type { FrigateClip } from '../types';
import { RefreshCw, Grid, List } from 'lucide-react';
import toast from 'react-hot-toast';

export const ClipsPage = () => {
  const { clips, cameras, isLoading, fetchClips, fetchCameras, downloadClip } = useFrigateStore();
  const [selectedClip, setSelectedClip] = useState<FrigateClip | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchClips({ limit: 50 });
    fetchCameras();
  }, []);

  const handleFilterChange = (filters: any) => {
    fetchClips({ ...filters, limit: 50 });
  };

  const handleReset = () => {
    fetchClips({ limit: 50 });
  };

  const handleRefresh = () => {
    fetchClips({ limit: 50 });
    toast.success('Clips refreshed');
  };

  const handlePlayClip = (clip: FrigateClip) => {
    setSelectedClip(clip);
    setIsPlayerOpen(true);
  };

  const handleDownload = async (clip: FrigateClip) => {
    try {
      await downloadClip(clip.id);
      toast.success('Clip downloaded successfully');
    } catch (error) {
      toast.error('Failed to download clip');
    }
  };

  const getClipUrl = (clip: FrigateClip) => {
    // Construct the clip URL from the backend/Frigate
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000'}/api/frigate/clips/${clip.id}/download`;
  };

  const getThumbnailUrl = (clip: FrigateClip) => {
    return `http://localhost:8971/api/events/${clip.id}/thumbnail.jpg`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Video Clips</h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Browse recorded video clips from Frigate NVR
          </p>
        </div>

        <div className="flex gap-3">
          <div className="flex gap-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-secondary-700 shadow'
                  : 'hover:bg-secondary-200 dark:hover:bg-secondary-700'
              }`}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-secondary-700 shadow'
                  : 'hover:bg-secondary-200 dark:hover:bg-secondary-700'
              }`}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>

          <Button variant="secondary" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ClipFilters cameras={cameras} onFilterChange={handleFilterChange} onReset={handleReset} />

      {/* Clips Grid/List */}
      {isLoading ? (
        <div className="card">
          <LoadingSpinner className="py-12" />
        </div>
      ) : clips.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <p className="text-secondary-500 mb-2">No clips found</p>
            <p className="text-sm text-secondary-400">Try adjusting your filters</p>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {clips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              onPlay={handlePlayClip}
              onDownload={handleDownload}
              thumbnailUrl={getThumbnailUrl(clip)}
            />
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedClip && (
        <Modal
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          title={`${selectedClip.camera} - ${new Date(selectedClip.start_time * 1000).toLocaleString()}`}
          size="xl"
        >
          <VideoPlayer
            url={getClipUrl(selectedClip)}
            title={selectedClip.camera}
            onDownload={() => handleDownload(selectedClip)}
          />
        </Modal>
      )}
    </div>
  );
};
