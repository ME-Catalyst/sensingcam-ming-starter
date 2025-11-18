declare module 'react-player' {
  import { Component, ReactNode } from 'react';

  export interface ReactPlayerProps {
    url?: string;
    playing?: boolean;
    loop?: boolean;
    controls?: boolean;
    light?: boolean;
    volume?: number;
    muted?: boolean;
    playbackRate?: number;
    width?: string | number;
    height?: string | number;
    style?: React.CSSProperties;
    progressInterval?: number;
    playsinline?: boolean;
    pip?: boolean;
    stopOnUnmount?: boolean;
    fallback?: ReactNode;
    wrapper?: any;
    config?: any;
    onReady?: () => void;
    onStart?: () => void;
    onPlay?: () => void;
    onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
    onDuration?: (duration: number) => void;
    onPause?: () => void;
    onBuffer?: () => void;
    onBufferEnd?: () => void;
    onEnded?: () => void;
    onError?: (error: any) => void;
    onClickPreview?: (event: any) => void;
    onEnablePIP?: () => void;
    onDisablePIP?: () => void;
    onSeek?: (seconds: number) => void;
    onPlaybackRateChange?: (speed: number) => void;
    [key: string]: any;
  }

  export default class ReactPlayer extends Component<ReactPlayerProps> {
    wrapper?: HTMLDivElement;
    seekTo(amount: number, type?: 'seconds' | 'fraction'): void;
    getCurrentTime(): number;
    getSecondsLoaded(): number;
    getDuration(): number;
    getInternalPlayer(key?: string): any;
  }
}
