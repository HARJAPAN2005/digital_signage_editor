export type SignageWidgetType =
  | "audio"
  | "calendar"
  | "chart"
  | "clock"
  | "countdown"
  | "datasetTicker"
  | "datasetView"
  | "embedded"
  | "flash"
  | "hls"
  | "htmlPackage"
  | "image"
  | "iframe"
  | "localVideo"
  | "notification"
  | "pdf"
  | "powerpoint"
  | "shellCommand"
  | "spacer"
  | "subPlaylist"
  | "text"
  | "ticker"
  | "video"
  | "videoIn"
  | "webpage";

export interface CalendarConfig {
  calendarUrl: string;
  displayMode: "month" | "week" | "day";
  refreshInterval: number;
}

export interface ChartConfig {
  chartType: "bar" | "line" | "pie" | "donut";
  dataSource: "manual" | "api";
  apiUrl?: string;
  refreshInterval?: number;
  data: { label: string; value: number }[];
  colors: string[];
  title: string;
}

export interface ClockConfig {
  format: "12h" | "24h";
  clockType?: "digital" | "analog";
  timezone: string;
  showSeconds: boolean;
  fontFamily: string;
  fontSize: number;
  color: string;
  position: { x: number; y: number };
}

export interface CountdownConfig {
  targetDateTime: string;
  format: "DD:HH:MM:SS" | "HH:MM:SS" | "MM:SS";
  completedMessage: string;
  fontSize: number;
  color: string;
  position: { x: number; y: number };
}

export interface PDFConfig {
  file: File | null;
  secondsPerPage: number;
  totalPages: number;
  loop: boolean;
}

export interface PowerPointConfig {
  file: File | null;
  secondsPerSlide: number;
  totalSlides: number;
  loop: boolean;
}

export interface TickerConfig {
  text: string;
  speed: number;
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
  fontSize: number;
  position: "top" | "bottom";
  dataSource?: string;
  refreshInterval?: number;
}

export interface IframeConfig {
  src: string;
  title: string;
  allowFullscreen: boolean;
  renderMode: "iframe" | "snapshot" | "auto";
  snapshotRefreshInterval: number;
  sandbox:
    | ""
    | "allow-scripts"
    | "allow-same-origin"
    | "allow-scripts allow-same-origin";
  borderRadius: number;
  zoom: number;
  transparentBackground: boolean;
}

export interface TextWidgetConfig {
  text: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  textAlign: "left" | "center" | "right";
  fontFamily: string;
}

export interface NotificationConfig {
  title: string;
  message: string;
  level: "info" | "warning" | "error" | "success";
  backgroundColor: string;
  textColor: string;
}

export interface SpacerConfig {
  backgroundColor: string;
}

export interface ShellCommandConfig {
  command: string;
  output: string;
}

export interface SubPlaylistConfig {
  items: string[];
  secondsPerItem: number;
}

export interface DatasetTickerConfig {
  title: string;
  entries: string[];
  speed: number;
  backgroundColor: string;
  textColor: string;
}

export interface DatasetViewConfig {
  title: string;
  columns: string[];
  rows: string[][];
  headerBackground: string;
}

export interface WebpageConfig {
  url: string;
  title: string;
}

export interface EmbeddedConfig {
  embedUrl: string;
  title: string;
}

export interface VideoInConfig {
  sourceName: string;
  status: string;
}

export interface HLSConfig {
  streamUrl: string;
  autoplay: boolean;
  muted: boolean;
}

export interface HtmlPackageConfig {
  html: string;
}

export interface FlashConfig {
  sourceUrl: string;
  fallbackText: string;
}

export interface LocalVideoConfig {
  videoUrl: string;
  loop: boolean;
  muted: boolean;
}

export interface ImageWidgetConfig {
  imageUrl: string;
  objectFit: "cover" | "contain";
}

export interface VideoWidgetConfig {
  videoUrl: string;
  loop: boolean;
  muted: boolean;
  autoplay: boolean;
}

export interface AudioWidgetConfig {
  audioUrl: string;
  title: string;
}

export type WidgetConfig =
  | AudioWidgetConfig
  | CalendarConfig
  | ChartConfig
  | ClockConfig
  | CountdownConfig
  | DatasetTickerConfig
  | DatasetViewConfig
  | EmbeddedConfig
  | FlashConfig
  | HLSConfig
  | HtmlPackageConfig
  | ImageWidgetConfig
  | IframeConfig
  | LocalVideoConfig
  | NotificationConfig
  | PDFConfig
  | PowerPointConfig
  | ShellCommandConfig
  | SpacerConfig
  | SubPlaylistConfig
  | TextWidgetConfig
  | TickerConfig
  | VideoInConfig
  | VideoWidgetConfig
  | WebpageConfig;

export interface SignageWidget {
  id: string;
  type: SignageWidgetType;
  startTime: number;
  duration: number;
  config: WidgetConfig;
  locked?: boolean;
  hidden?: boolean;
  layout?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
