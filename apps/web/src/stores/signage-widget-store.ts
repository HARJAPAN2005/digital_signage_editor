import { create } from "zustand";
import type {
  AudioWidgetConfig,
  CalendarConfig,
  ChartConfig,
  ClockConfig,
  CountdownConfig,
  DatasetTickerConfig,
  DatasetViewConfig,
  EmbeddedConfig,
  FlashConfig,
  HLSConfig,
  HtmlPackageConfig,
  ImageWidgetConfig,
  IframeConfig,
  LocalVideoConfig,
  NotificationConfig,
  PDFConfig,
  PowerPointConfig,
  ShellCommandConfig,
  SignageWidget,
  SignageWidgetType,
  SpacerConfig,
  SubPlaylistConfig,
  TextWidgetConfig,
  TickerConfig,
  VideoInConfig,
  VideoWidgetConfig,
  WebpageConfig,
  WidgetConfig,
} from "../types/widgets";

type DefaultConfigs = {
  audio: AudioWidgetConfig;
  calendar: CalendarConfig;
  chart: ChartConfig;
  clock: ClockConfig;
  countdown: CountdownConfig;
  datasetTicker: DatasetTickerConfig;
  datasetView: DatasetViewConfig;
  embedded: EmbeddedConfig;
  flash: FlashConfig;
  hls: HLSConfig;
  htmlPackage: HtmlPackageConfig;
  image: ImageWidgetConfig;
  iframe: IframeConfig;
  localVideo: LocalVideoConfig;
  notification: NotificationConfig;
  pdf: PDFConfig;
  powerpoint: PowerPointConfig;
  shellCommand: ShellCommandConfig;
  spacer: SpacerConfig;
  subPlaylist: SubPlaylistConfig;
  text: TextWidgetConfig;
  ticker: TickerConfig;
  video: VideoWidgetConfig;
  videoIn: VideoInConfig;
  webpage: WebpageConfig;
};

interface SignageWidgetState {
  widgets: SignageWidget[];
  addWidget: (widget: SignageWidget) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<SignageWidget>) => void;
  updateWidgetConfig: (id: string, config: WidgetConfig) => void;
}

export const defaultConfigs: DefaultConfigs = {
  audio: {
    audioUrl: "",
    title: "Now Playing",
  },
  calendar: {
    calendarUrl: "",
    displayMode: "month",
    refreshInterval: 300,
  },
  chart: {
    chartType: "bar",
    dataSource: "manual",
    data: [
      { label: "A", value: 12 },
      { label: "B", value: 18 },
      { label: "C", value: 9 },
    ],
    colors: ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"],
    title: "Data Chart",
    refreshInterval: 30,
  },
  clock: {
    format: "24h",
    clockType: "digital",
    timezone: "Asia/Kolkata",
    showSeconds: true,
    fontFamily: "Inter",
    fontSize: 42,
    color: "#ffffff",
    position: { x: 40, y: 40 },
  },
  countdown: {
    targetDateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    format: "HH:MM:SS",
    completedMessage: "Countdown complete",
    fontSize: 42,
    color: "#ffffff",
    position: { x: 40, y: 90 },
  },
  datasetTicker: {
    title: "Updates",
    entries: ["Welcome", "Store opens at 9 AM", "New offers available now"],
    speed: 60,
    backgroundColor: "#111827",
    textColor: "#ffffff",
  },
  datasetView: {
    title: "Dataset View",
    columns: ["Name", "Value"],
    rows: [
      ["Alpha", "120"],
      ["Beta", "95"],
      ["Gamma", "140"],
    ],
    headerBackground: "#1f2937",
  },
  embedded: {
    embedUrl: "https://example.com",
    title: "Embedded Content",
  },
  flash: {
    sourceUrl: "",
    fallbackText: "Flash content is not supported in modern browsers.",
  },
  hls: {
    streamUrl: "",
    autoplay: true,
    muted: true,
  },
  htmlPackage: {
    html: "<div style='color:white;font-family:sans-serif;padding:16px'>HTML Package</div>",
  },
  image: {
    imageUrl: "",
    objectFit: "contain",
  },
  iframe: {
    src: "https://www.w3schools.com",
    title: "Embedded content",
    allowFullscreen: true,
    renderMode: "auto",
    snapshotRefreshInterval: 30,
    sandbox: "allow-scripts allow-same-origin",
    borderRadius: 8,
    zoom: 1,
    transparentBackground: false,
  },
  localVideo: {
    videoUrl: "",
    loop: true,
    muted: true,
  },
  notification: {
    title: "Notification",
    message: "Your scheduled content is live.",
    level: "info",
    backgroundColor: "#1f2937",
    textColor: "#ffffff",
  },
  pdf: {
    file: null,
    secondsPerPage: 5,
    totalPages: 0,
    loop: true,
  },
  powerpoint: {
    file: null,
    secondsPerSlide: 5,
    totalSlides: 0,
    loop: true,
  },
  shellCommand: {
    command: "echo Digital Signage",
    output: "Digital Signage",
  },
  spacer: {
    backgroundColor: "#000000",
  },
  subPlaylist: {
    items: ["Playlist Item 1", "Playlist Item 2", "Playlist Item 3"],
    secondsPerItem: 5,
  },
  text: {
    text: "Sample Text Widget",
    fontSize: 32,
    color: "#ffffff",
    backgroundColor: "transparent",
    textAlign: "center",
    fontFamily: "Inter",
  },
  ticker: {
    text: "Welcome to Digital Signage",
    speed: 50,
    backgroundColor: "#111827",
    textColor: "#ffffff",
    fontFamily: "Inter",
    fontSize: 24,
    position: "bottom",
    refreshInterval: 60,
  },
  video: {
    videoUrl: "",
    loop: true,
    muted: true,
    autoplay: true,
  },
  videoIn: {
    sourceName: "HDMI Input",
    status: "No signal",
  },
  webpage: {
    url: "https://www.example.com",
    title: "Webpage",
  },
};

export const cloneDefaultWidgetConfig = (type: SignageWidgetType): WidgetConfig =>
  structuredClone(defaultConfigs[type]);

export const useSignageWidgetStore = create<SignageWidgetState>((set) => ({
  widgets: [],
  addWidget: (widget) => set((state) => ({ widgets: [...state.widgets, widget] })),
  removeWidget: (id) =>
    set((state) => ({ widgets: state.widgets.filter((widget) => widget.id !== id) })),
  updateWidget: (id, updates) =>
    set((state) => ({
      widgets: state.widgets.map((widget) =>
        widget.id === id ? { ...widget, ...updates } : widget,
      ),
    })),
  updateWidgetConfig: (id, config) =>
    set((state) => ({
      widgets: state.widgets.map((widget) =>
        widget.id === id ? { ...widget, config } : widget,
      ),
    })),
}));
