export interface SignageResolutionPreset {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const SIGNAGE_RESOLUTION_PRESETS: readonly SignageResolutionPreset[] = [
  { id: "1080p-landscape", label: "1080p HD Landscape", width: 1920, height: 1080 },
  { id: "1080p-portrait", label: "1080p HD Portrait", width: 1080, height: 1920 },
  { id: "4k-cinema", label: "4K Cinema", width: 4096, height: 2304 },
  { id: "4k-uhd-landscape", label: "4K UHD Landscape", width: 3840, height: 2160 },
  { id: "4k-uhd-portrait", label: "4K UHD Portrait", width: 2160, height: 3840 },
  { id: "720p-landscape", label: "720p HD Landscape", width: 1280, height: 720 },
  { id: "720p-portrait", label: "720p HD Portrait", width: 720, height: 1280 },
  { id: "banner", label: "Banner", width: 1080, height: 320 },
] as const;

/** Find the preset matching a (width, height) pair, or undefined if it's a custom resolution. */
export const findPresetByDimensions = (
  width: number,
  height: number,
): SignageResolutionPreset | undefined =>
  SIGNAGE_RESOLUTION_PRESETS.find((p) => p.width === width && p.height === height);
