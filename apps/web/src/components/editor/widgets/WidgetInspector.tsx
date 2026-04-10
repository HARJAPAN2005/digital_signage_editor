import React from "react";
import { useSignageWidgetStore } from "../../../stores/signage-widget-store";
import * as pdfjs from "pdfjs-dist";
import type {
  CalendarConfig,
  ChartConfig,
  ClockConfig,
  CountdownConfig,
  IframeConfig,
  PDFConfig,
  PowerPointConfig,
  SignageWidget,
  TickerConfig,
} from "../../../types/widgets";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface WidgetInspectorProps {
  widget: SignageWidget;
}

export const WidgetInspector: React.FC<WidgetInspectorProps> = ({ widget }) => {
  const updateWidget = useSignageWidgetStore((state) => state.updateWidget);
  const updateWidgetConfig = useSignageWidgetStore((state) => state.updateWidgetConfig);

  const updateConfig = (config: SignageWidget["config"]) => {
    updateWidgetConfig(widget.id, config);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border p-3 bg-background-tertiary">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase bg-[#1e1e2e] text-[#8888aa] px-2 py-1 rounded border border-[#2e2e42]">
            {widget.type} widget
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateWidget(widget.id, { locked: !widget.locked })}
              className="text-[10px] px-2 py-1 rounded border border-border text-text-secondary bg-background hover:bg-background-elevated"
            >
              {widget.locked ? "Unlock" : "Lock"}
            </button>
            <button
              onClick={() => updateWidget(widget.id, { hidden: !widget.hidden })}
              className="text-[10px] px-2 py-1 rounded border border-border text-text-secondary bg-background hover:bg-background-elevated"
            >
              {widget.hidden ? "Show" : "Hide"}
            </button>
            <button
              onClick={() => {
                useSignageWidgetStore.getState().removeWidget(widget.id);
              }}
              className="text-[10px] px-2 py-1 rounded border border-red-500/40 text-red-300 bg-red-500/10 hover:bg-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <label className="text-[10px] text-text-secondary">Start</label>
          <input
            type="number"
            className="bg-background border border-border rounded px-2 py-1 text-xs"
            value={widget.startTime}
            onChange={(e) => updateWidget(widget.id, { startTime: Number(e.target.value) || 0 })}
          />
          <label className="text-[10px] text-text-secondary">Duration</label>
          <input
            type="number"
            className="bg-background border border-border rounded px-2 py-1 text-xs"
            value={widget.duration}
            onChange={(e) => updateWidget(widget.id, { duration: Number(e.target.value) || 1 })}
          />
          <label className="text-[10px] text-text-secondary">X</label>
          <input
            type="number"
            className="bg-background border border-border rounded px-2 py-1 text-xs"
            value={widget.layout?.x ?? 40}
            onChange={(e) =>
              updateWidget(widget.id, {
                layout: {
                  x: Number(e.target.value) || 0,
                  y: widget.layout?.y ?? 40,
                  width: widget.layout?.width ?? 360,
                  height: widget.layout?.height ?? 220,
                },
              })
            }
          />
          <label className="text-[10px] text-text-secondary">Y</label>
          <input
            type="number"
            className="bg-background border border-border rounded px-2 py-1 text-xs"
            value={widget.layout?.y ?? 40}
            onChange={(e) =>
              updateWidget(widget.id, {
                layout: {
                  x: widget.layout?.x ?? 40,
                  y: Number(e.target.value) || 0,
                  width: widget.layout?.width ?? 360,
                  height: widget.layout?.height ?? 220,
                },
              })
            }
          />
          <label className="text-[10px] text-text-secondary">Width</label>
          <input
            type="number"
            className="bg-background border border-border rounded px-2 py-1 text-xs"
            value={widget.layout?.width ?? 360}
            onChange={(e) =>
              updateWidget(widget.id, {
                layout: {
                  x: widget.layout?.x ?? 40,
                  y: widget.layout?.y ?? 40,
                  width: Number(e.target.value) || 120,
                  height: widget.layout?.height ?? 220,
                },
              })
            }
          />
          <label className="text-[10px] text-text-secondary">Height</label>
          <input
            type="number"
            className="bg-background border border-border rounded px-2 py-1 text-xs"
            value={widget.layout?.height ?? 220}
            onChange={(e) =>
              updateWidget(widget.id, {
                layout: {
                  x: widget.layout?.x ?? 40,
                  y: widget.layout?.y ?? 40,
                  width: widget.layout?.width ?? 360,
                  height: Number(e.target.value) || 80,
                },
              })
            }
          />
        </div>
      </div>

      {widget.type === "clock" && (
        <ClockFields config={widget.config as ClockConfig} onChange={updateConfig} />
      )}
      {widget.type === "countdown" && (
        <CountdownFields config={widget.config as CountdownConfig} onChange={updateConfig} />
      )}
      {widget.type === "ticker" && (
        <TickerFields 
          config={widget.config as TickerConfig} 
          onChange={updateConfig} 
          layout={widget.layout}
          onLayoutChange={(w, h) => updateWidget(widget.id, { layout: { ...(widget.layout || { x:0, y:0 }), width: w, height: h }})}
        />
      )}
      {widget.type === "iframe" && (
        <IframeFields config={widget.config as IframeConfig} onChange={updateConfig} />
      )}
      {widget.type === "pdf" && (
        <PDFFields
          config={widget.config as PDFConfig}
          onChange={updateConfig}
          onDurationChange={(duration) => updateWidget(widget.id, { duration })}
        />
      )}
      {widget.type === "powerpoint" && (
        <PowerPointFields config={widget.config as PowerPointConfig} onChange={updateConfig} />
      )}
      {widget.type === "chart" && (
        <ChartFields config={widget.config as ChartConfig} onChange={updateConfig} />
      )}
      {widget.type === "calendar" && (
        <CalendarFields config={widget.config as CalendarConfig} onChange={updateConfig} />
      )}
    </div>
  );
};

const ClockFields = ({ config, onChange }: { config: ClockConfig; onChange: (v: ClockConfig) => void }) => (
  <div className="space-y-2 rounded-lg border border-border p-3 bg-background-tertiary">
    <div className="grid grid-cols-2 gap-2">
      <select className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.clockType || "digital"} onChange={(e) => onChange({ ...config, clockType: e.target.value as ClockConfig["clockType"] })}>
        <option value="digital">Digital Clock</option>
        <option value="analog">Analog Clock</option>
      </select>
      <select className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.format} onChange={(e) => onChange({ ...config, format: e.target.value as ClockConfig["format"] })}>
        <option value="12h">12h</option><option value="24h">24h</option>
      </select>
    </div>
    <select className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.timezone} onChange={(e) => onChange({ ...config, timezone: e.target.value })}>
      <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
      <option value="UTC">UTC</option>
      <option value="America/New_York">EST (New York)</option>
      <option value="America/Chicago">CST (Chicago)</option>
      <option value="America/Denver">MST (Denver)</option>
      <option value="America/Los_Angeles">PST (Los Angeles)</option>
      <option value="Europe/London">GMT (London)</option>
      <option value="Europe/Paris">CET (Paris)</option>
      <option value="Asia/Tokyo">JST (Tokyo)</option>
      <option value="Australia/Sydney">AEDT (Sydney)</option>
    </select>
    <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={config.showSeconds} onChange={(e) => onChange({ ...config, showSeconds: e.target.checked })} />Show seconds</label>
    <input type="color" className="w-full h-8" value={config.color} onChange={(e) => onChange({ ...config, color: e.target.value })} />
    <input type="number" className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.fontSize} onChange={(e) => onChange({ ...config, fontSize: Number(e.target.value) || 12 })} placeholder="Font size" />
    <div className="grid grid-cols-2 gap-2">
      <input type="number" className="bg-background border border-border rounded px-2 py-1 text-xs" value={config.position.x} onChange={(e) => onChange({ ...config, position: { ...config.position, x: Number(e.target.value) || 0 } })} placeholder="X" />
      <input type="number" className="bg-background border border-border rounded px-2 py-1 text-xs" value={config.position.y} onChange={(e) => onChange({ ...config, position: { ...config.position, y: Number(e.target.value) || 0 } })} placeholder="Y" />
    </div>
  </div>
);

const CountdownFields = ({ config, onChange }: { config: CountdownConfig; onChange: (v: CountdownConfig) => void }) => (
  <div className="space-y-2 rounded-lg border border-border p-3 bg-background-tertiary">
    <input type="datetime-local" className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.targetDateTime.slice(0, 16)} onChange={(e) => onChange({ ...config, targetDateTime: new Date(e.target.value).toISOString() })} />
    <select className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.format} onChange={(e) => onChange({ ...config, format: e.target.value as CountdownConfig["format"] })}>
      <option value="DD:HH:MM:SS">DD:HH:MM:SS</option><option value="HH:MM:SS">HH:MM:SS</option><option value="MM:SS">MM:SS</option>
    </select>
    <input className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.completedMessage} onChange={(e) => onChange({ ...config, completedMessage: e.target.value })} placeholder="Completed message" />
    <input type="color" value={config.color} onChange={(e) => onChange({ ...config, color: e.target.value })} />
    <input type="number" className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.fontSize} onChange={(e) => onChange({ ...config, fontSize: Number(e.target.value) || 12 })} placeholder="Font size" />
  </div>
);

const TickerFields = ({ 
  config, 
  onChange,
  layout,
  onLayoutChange
}: { 
  config: TickerConfig; 
  onChange: (v: TickerConfig) => void;
  layout?: { x: number; y: number; width: number; height: number };
  onLayoutChange?: (width: number, height: number) => void;
}) => (
  <div className="space-y-2 rounded-lg border border-border p-3 bg-background-tertiary">
    <label className="text-[10px] text-text-secondary">Message</label>
    <textarea className="w-full h-20 bg-background border border-border rounded px-2 py-1 text-xs" value={config.text} onChange={(e) => onChange({ ...config, text: e.target.value })} placeholder="Ticker text..." />
    
    <label className="text-[10px] text-text-secondary flex justify-between">
      <span>Scroll Speed</span>
      <span>{config.speed}</span>
    </label>
    <input type="range" min={10} max={300} value={config.speed} onChange={(e) => onChange({ ...config, speed: Number(e.target.value) })} className="w-full" />
    
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-[10px] text-text-secondary block mb-1">Background Color</label>
        <input type="color" className="w-full h-8" value={config.backgroundColor} onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })} />
      </div>
      <div>
        <label className="text-[10px] text-text-secondary block mb-1">Text Color</label>
        <input type="color" className="w-full h-8" value={config.textColor} onChange={(e) => onChange({ ...config, textColor: e.target.value })} />
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div>
        <label className="text-[10px] text-text-secondary block mb-1">Font Family</label>
        <select 
          className="w-full bg-background border border-border rounded px-2 py-1 text-xs" 
          value={config.fontFamily || "Inter"} 
          onChange={(e) => onChange({ ...config, fontFamily: e.target.value })}
        >
          <option value="Inter">Inter (Default)</option>
          <option value="Roboto">Roboto</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Arial">Arial</option>
          <option value="Open Sans">Open Sans</option>
          <option value="Montserrat">Montserrat</option>
        </select>
      </div>
      <div>
        <label className="text-[10px] text-text-secondary block mb-1">Font Size (px)</label>
        <input type="number" className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.fontSize} onChange={(e) => onChange({ ...config, fontSize: Number(e.target.value) || 12 })} placeholder="16" />
      </div>
    </div>

    {layout && onLayoutChange && (
      <div className="pt-2 border-t border-border mt-2">
        <label className="text-[10px] text-text-secondary flex justify-between">
          <span>Strip Thickness (Height)</span>
          <span>{layout.height}px</span>
        </label>
        <input 
          type="range" 
          min={30} 
          max={400} 
          value={layout.height} 
          onChange={(e) => onLayoutChange(layout.width, Number(e.target.value))} 
          className="w-full" 
        />
      </div>
    )}
  </div>
);

const IframeFields = ({
  config,
  onChange,
}: {
  config: IframeConfig;
  onChange: (v: IframeConfig) => void;
}) => (
  <div className="space-y-2 rounded-lg border border-border p-3 bg-background-tertiary">
    <input
      className="w-full bg-background border border-border rounded px-2 py-1 text-xs"
      value={config.src}
      onChange={(e) => onChange({ ...config, src: e.target.value })}
      placeholder="https://example.com"
    />
    <div className="flex gap-2">
      <button
        className="text-[10px] px-2 py-1 rounded border border-border hover:bg-background-elevated"
        onClick={() => {
          const raw = (config.src || "").trim();
          if (!raw) return;
          const withProtocol =
            raw.startsWith("http://") || raw.startsWith("https://")
              ? raw
              : `https://${raw}`;
          window.open(withProtocol, "_blank", "noopener,noreferrer");
        }}
      >
        Open URL in new tab
      </button>
      <button
        className="text-[10px] px-2 py-1 rounded border border-border hover:bg-background-elevated"
        onClick={() => {
          const raw = (config.src || "").trim();
          if (!raw) return;
          const withProtocol =
            raw.startsWith("http://") || raw.startsWith("https://")
              ? raw
              : `https://${raw}`;
          try {
            const url = new URL(withProtocol);
            const host = url.hostname.toLowerCase();
            const path = url.pathname;
            if (host.includes("docs.google.com")) {
              if (path.includes("/document/") || path.includes("/presentation/")) {
                url.pathname = path.replace(/\/edit.*$/, "/preview");
                url.search = "";
                onChange({ ...config, src: url.toString() });
                return;
              }
              if (path.includes("/spreadsheets/")) {
                url.pathname = path.replace(/\/edit.*$/, "/preview");
                onChange({ ...config, src: url.toString() });
                return;
              }
            }
          } catch {
            // ignore
          }
        }}
      >
        Convert to embeddable URL
      </button>
    </div>
    <p className="text-[10px] text-text-muted">
      Some sites block iframe embedding via security headers (X-Frame-Options / CSP).
    </p>
    <input
      className="w-full bg-background border border-border rounded px-2 py-1 text-xs"
      value={config.title}
      onChange={(e) => onChange({ ...config, title: e.target.value })}
      placeholder="Frame title"
    />
    <label className="text-xs flex items-center gap-2">
      <input
        type="checkbox"
        checked={config.allowFullscreen}
        onChange={(e) => onChange({ ...config, allowFullscreen: e.target.checked })}
      />
      Allow fullscreen
    </label>
    <select
      className="w-full bg-background border border-border rounded px-2 py-1 text-xs"
      value={config.renderMode}
      onChange={(e) => onChange({ ...config, renderMode: e.target.value as IframeConfig["renderMode"] })}
    >
      <option value="auto">Auto (iframe then snapshot fallback)</option>
      <option value="iframe">Direct iframe</option>
      <option value="snapshot">Snapshot proxy</option>
    </select>
    <input
      type="number"
      className="w-full bg-background border border-border rounded px-2 py-1 text-xs"
      value={config.snapshotRefreshInterval}
      onChange={(e) =>
        onChange({ ...config, snapshotRefreshInterval: Number(e.target.value) || 30 })
      }
      placeholder="Snapshot refresh (seconds)"
    />
    <select
      className="w-full bg-background border border-border rounded px-2 py-1 text-xs"
      value={config.sandbox}
      onChange={(e) => onChange({ ...config, sandbox: e.target.value as IframeConfig["sandbox"] })}
    >
      <option value="">No sandbox</option>
      <option value="allow-scripts">allow-scripts</option>
      <option value="allow-same-origin">allow-same-origin</option>
      <option value="allow-scripts allow-same-origin">
        allow-scripts allow-same-origin
      </option>
    </select>
    <input
      type="number"
      step="0.1"
      min="0.1"
      max="5.0"
      className="w-full bg-background border border-border rounded px-2 py-1 text-xs"
      value={config.zoom || 1}
      onChange={(e) => onChange({ ...config, zoom: Number(e.target.value) || 1 })}
      placeholder="Zoom level (e.g. 1)"
    />
    <label className="text-xs flex items-center gap-2">
      <input
        type="checkbox"
        checked={config.transparentBackground || false}
        onChange={(e) => onChange({ ...config, transparentBackground: e.target.checked })}
      />
      Transparent background
    </label>
    <input
      type="number"
      className="w-full bg-background border border-border rounded px-2 py-1 text-xs"
      value={config.borderRadius}
      onChange={(e) => onChange({ ...config, borderRadius: Number(e.target.value) || 0 })}
      placeholder="Border radius"
    />
  </div>
);

const PDFFields = ({
  config,
  onChange,
  onDurationChange,
}: {
  config: PDFConfig;
  onChange: (v: PDFConfig) => void;
  onDurationChange: (duration: number) => void;
}) => (
  <div className="space-y-2 rounded-lg border border-border p-3 bg-background-tertiary">
    <input
      type="file"
      accept=".pdf"
      onChange={async (e) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) {
          onChange({ ...config, file: null, totalPages: 0 });
          return;
        }
        const bytes = await file.arrayBuffer();
        const doc = await pdfjs.getDocument({ data: bytes }).promise;
        const totalPages = doc.numPages;
        onChange({ ...config, file, totalPages });
        onDurationChange(totalPages * Math.max(1, config.secondsPerPage));
      }}
    />
    <input
      type="number"
      className="w-full bg-background border border-border rounded px-2 py-1 text-xs"
      value={config.secondsPerPage}
      onChange={(e) => {
        const secondsPerPage = Number(e.target.value) || 1;
        onChange({ ...config, secondsPerPage });
        onDurationChange((config.totalPages || 0) * secondsPerPage);
      }}
    />
    <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={config.loop} onChange={(e) => onChange({ ...config, loop: e.target.checked })} />Loop</label>
  </div>
);

const PowerPointFields = ({ config, onChange }: { config: PowerPointConfig; onChange: (v: PowerPointConfig) => void }) => (
  <div className="space-y-2 rounded-lg border border-border p-3 bg-background-tertiary">
    <input type="file" accept=".pptx" onChange={(e) => onChange({ ...config, file: e.target.files?.[0] ?? null })} />
    <input type="number" className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.secondsPerSlide} onChange={(e) => onChange({ ...config, secondsPerSlide: Number(e.target.value) || 1 })} />
    <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={config.loop} onChange={(e) => onChange({ ...config, loop: e.target.checked })} />Loop</label>
  </div>
);

const ChartFields = ({ config, onChange }: { config: ChartConfig; onChange: (v: ChartConfig) => void }) => (
  <div className="space-y-2 rounded-lg border border-border p-3 bg-background-tertiary">
    <select className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.chartType} onChange={(e) => onChange({ ...config, chartType: e.target.value as ChartConfig["chartType"] })}>
      <option value="bar">Bar</option><option value="line">Line</option><option value="pie">Pie</option><option value="donut">Donut</option>
    </select>
    <div className="flex gap-3 text-xs">
      <label><input type="radio" checked={config.dataSource === "manual"} onChange={() => onChange({ ...config, dataSource: "manual" })} /> Manual</label>
      <label><input type="radio" checked={config.dataSource === "api"} onChange={() => onChange({ ...config, dataSource: "api" })} /> API</label>
    </div>
    {config.dataSource === "api" ? (
      <>
        <input className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.apiUrl ?? ""} onChange={(e) => onChange({ ...config, apiUrl: e.target.value })} placeholder="API URL" />
        <input type="number" className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.refreshInterval ?? 30} onChange={(e) => onChange({ ...config, refreshInterval: Number(e.target.value) || 30 })} placeholder="Refresh interval (s)" />
      </>
    ) : (
      <textarea className="w-full h-24 bg-background border border-border rounded px-2 py-1 text-xs" value={JSON.stringify(config.data, null, 2)} onChange={(e) => { try { onChange({ ...config, data: JSON.parse(e.target.value) }); } catch { /* ignore invalid json while typing */ } }} />
    )}
    <input className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.colors.join(",")} onChange={(e) => onChange({ ...config, colors: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} placeholder="Colors comma-separated" />
  </div>
);

const CalendarFields = ({ config, onChange }: { config: CalendarConfig; onChange: (v: CalendarConfig) => void }) => (
  <div className="space-y-2 rounded-lg border border-border p-3 bg-background-tertiary">
    <input className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.calendarUrl} onChange={(e) => onChange({ ...config, calendarUrl: e.target.value })} placeholder="Calendar iCal URL" />
    <select className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.displayMode} onChange={(e) => onChange({ ...config, displayMode: e.target.value as CalendarConfig["displayMode"] })}>
      <option value="month">Month</option><option value="week">Week</option><option value="day">Day</option>
    </select>
    <input type="number" className="w-full bg-background border border-border rounded px-2 py-1 text-xs" value={config.refreshInterval} onChange={(e) => onChange({ ...config, refreshInterval: Number(e.target.value) || 60 })} />
  </div>
);

export default WidgetInspector;
