/**
 * Streaming service contract (architectural placeholder).
 *
 * Target: 3840×2160 @ 60 FPS output, hardware-accelerated capture and
 * encode, low-latency delivery to viewers inside and outside hubs.
 * This file pins the interfaces; the encoding/transport milestone
 * implements them.
 *
 * No implementation yet — the shape is the contract.
 */

export interface StreamQuality {
  width: number;
  height: number;
  fps: number;
  bitrateKbps: number;
}

export interface StreamSource {
  id: string;
  label: string;
  kind: "screen" | "window" | "game";
}

export interface StreamSession {
  id: string;
  source: StreamSource;
  quality: StreamQuality;
  startedAt: number;
}

export interface StreamingService {
  listSources(): Promise<StreamSource[]>;
  start(session: Pick<StreamSession, "source" | "quality">): Promise<StreamSession>;
  stop(sessionId: string): Promise<void>;
  setQuality(sessionId: string, quality: StreamQuality): Promise<void>;
  onStateChange(callback: (session: StreamSession | null) => void): () => void;
}

/** The 4K/60 target the architecture must hit without rewrites. */
export const flagshipQuality: StreamQuality = {
  width: 3840,
  height: 2160,
  fps: 60,
  bitrateKbps: 15_000,
};

/**
 * No-op default so imports compile today. The streaming milestone
 * replaces this singleton; consumers depend only on the interface.
 */
export const streamingService: StreamingService = {
  listSources: async () => [],
  start: async () => {
    throw new Error("Streaming is not implemented in this milestone.");
  },
  stop: async () => {},
  setQuality: async () => {},
  onStateChange: () => () => {},
};
