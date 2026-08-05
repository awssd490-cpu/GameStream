/**
 * Performance service contract (architectural placeholder).
 *
 * Goal: the Performance Manifesto — low-end PCs must stay smooth while
 * gaming, voice-chatting and streaming. Future milestones implement a
 * sampler that reports frame times, memory pressure and network jitter
 * so the UI can adapt (drop animation load, pause background work).
 *
 * No implementation yet — the shape is the contract.
 */

export interface PerformanceSample {
  timestamp: number;
  /** Rolling average frame time in milliseconds. */
  frameTimeMs: number;
  /** Approximate resident set size in megabytes. */
  memoryMb: number;
  /** Percent of the frame budget consumed by UI work (0–100). */
  uiLoadPercent: number;
  /** Voice/stream network jitter, if an audio/video service is live. */
  jitterMs?: number;
}

export interface PerformanceThresholds {
  /** Frame time (ms) above which the shell should reduce animation. */
  reducedMotionThresholdMs: number;
  /** Memory (MB) above which the shell should warn the user. */
  memoryWarningMb: number;
}

export interface PerformanceService {
  readonly enabled: boolean;
  startSampling(intervalMs: number): void;
  stopSampling(): void;
  onSample(callback: (sample: PerformanceSample) => void): () => void;
  /** Request the current baseline (single read, no polling). */
  sampleNow(): PerformanceSample;
}

export const performanceThresholds: PerformanceThresholds = {
  reducedMotionThresholdMs: 24, // ~41 FPS sustained
  memoryWarningMb: 2048,
};

/**
 * No-op default so imports compile today. Milestone(s) that implement
 * the sampler replace this singleton; the UI only ever depends on the
 * PerformanceService interface.
 */
export const performanceService: PerformanceService = {
  enabled: false,
  startSampling: () => {},
  stopSampling: () => {},
  onSample: () => () => {},
  sampleNow: () => ({
    timestamp: 0,
    frameTimeMs: 0,
    memoryMb: 0,
    uiLoadPercent: 0,
  }),
};
