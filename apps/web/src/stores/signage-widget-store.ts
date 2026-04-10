import { create } from "zustand";
import type {
  CalendarConfig,
  ChartConfig,
  ClockConfig,
  CountdownConfig,
  IframeConfig,
  PDFConfig,
  PowerPointConfig,
  SignageWidget,
  SignageWidgetType,
  TickerConfig,
  WidgetConfig,
} from "../types/widgets";

type DefaultConfigs = {
  calendar: CalendarConfig;
  chart: ChartConfig;
  clock: ClockConfig;
  countdown: CountdownConfig;
  iframe: IframeConfig;
  pdf: PDFConfig;
  powerpoint: PowerPointConfig;
  ticker: TickerConfig;
};

interface SignageWidgetState {
  widgets: SignageWidget[];
  addWidget: (widget: SignageWidget) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<SignageWidget>) => void;
  updateWidgetConfig: (id: string, config: WidgetConfig) => void;
}

export const defaultConfigs: DefaultConfigs = {
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
