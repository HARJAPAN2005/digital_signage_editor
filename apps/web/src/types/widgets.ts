export type SignageWidgetType =
  | "calendar"
  | "chart"
  | "clock"
  | "countdown"
  | "iframe"
  | "pdf"
  | "powerpoint"
  | "ticker";

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

export type WidgetConfig =
  | CalendarConfig
  | ChartConfig
  | ClockConfig
  | CountdownConfig
  | IframeConfig
  | PDFConfig
  | PowerPointConfig
  | TickerConfig;

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
