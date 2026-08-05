/**
 * Voice service contract (architectural placeholder).
 *
 * Target: Discord-quality voice at low latency with hardware
 * acceleration where possible. This pins the state machine and the
 * device/opus seams; the audio milestone implements them.
 *
 * No implementation yet — the shape is the contract.
 */

export type VoiceStatus = "idle" | "connecting" | "connected" | "muted" | "deafened";

export interface VoiceDevice {
  id: string;
  label: string;
  kind: "input" | "output";
  /** Measured round-trip latency in milliseconds when known. */
  latencyMs?: number;
}

export interface VoiceRoom {
  id: string;
  hubId: string;
  name: string;
}

export interface VoiceState {
  status: VoiceStatus;
  activeRoom: VoiceRoom | null;
  inputDevice: VoiceDevice | null;
  outputDevice: VoiceDevice | null;
  inputLevel: number;
}

export interface VoiceService {
  join(room: VoiceRoom): Promise<void>;
  leave(): Promise<void>;
  setInputDevice(device: VoiceDevice): Promise<void>;
  setOutputDevice(device: VoiceDevice): Promise<void>;
  toggleMute(): Promise<void>;
  toggleDeafen(): Promise<void>;
  onStateChange(callback: (state: VoiceState) => void): () => void;
  /** Current mic level (0–1) for the volume indicator. */
  readInputLevel(): number;
}

export const idleVoiceState: VoiceState = {
  status: "idle",
  activeRoom: null,
  inputDevice: null,
  outputDevice: null,
  inputLevel: 0,
};

/**
 * No-op default so imports compile today. The voice milestone replaces
 * this singleton; consumers depend only on the VoiceService interface.
 */
export const voiceService: VoiceService = {
  join: async () => {},
  leave: async () => {},
  setInputDevice: async () => {},
  setOutputDevice: async () => {},
  toggleMute: async () => {},
  toggleDeafen: async () => {},
  onStateChange: () => () => {},
  readInputLevel: () => 0,
};
