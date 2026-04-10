var E;
(function(i) {
  i.LOAD = "LOAD", i.EXEC = "EXEC", i.FFPROBE = "FFPROBE", i.WRITE_FILE = "WRITE_FILE", i.READ_FILE = "READ_FILE", i.DELETE_FILE = "DELETE_FILE", i.RENAME = "RENAME", i.CREATE_DIR = "CREATE_DIR", i.LIST_DIR = "LIST_DIR", i.DELETE_DIR = "DELETE_DIR", i.ERROR = "ERROR", i.DOWNLOAD = "DOWNLOAD", i.PROGRESS = "PROGRESS", i.LOG = "LOG", i.MOUNT = "MOUNT", i.UNMOUNT = "UNMOUNT";
})(E || (E = {}));
const h = /* @__PURE__ */ (() => {
  let i = 0;
  return () => i++;
})(), d = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first"), D = new Error("called FFmpeg.terminate()");
class O {
  #e = null;
  /**
   * #resolves and #rejects tracks Promise resolves and rejects to
   * be called when we receive message from web worker.
   */
  #i = {};
  #E = {};
  #s = [];
  #r = [];
  loaded = !1;
  /**
   * register worker message event handlers.
   */
  #n = () => {
    this.#e && (this.#e.onmessage = ({ data: { id: t, type: e, data: s } }) => {
      switch (e) {
        case E.LOAD:
          this.loaded = !0, this.#i[t](s);
          break;
        case E.MOUNT:
        case E.UNMOUNT:
        case E.EXEC:
        case E.FFPROBE:
        case E.WRITE_FILE:
        case E.READ_FILE:
        case E.DELETE_FILE:
        case E.RENAME:
        case E.CREATE_DIR:
        case E.LIST_DIR:
        case E.DELETE_DIR:
          this.#i[t](s);
          break;
        case E.LOG:
          this.#s.forEach((r) => r(s));
          break;
        case E.PROGRESS:
          this.#r.forEach((r) => r(s));
          break;
        case E.ERROR:
          this.#E[t](s);
          break;
      }
      delete this.#i[t], delete this.#E[t];
    });
  };
  /**
   * Generic function to send messages to web worker.
   */
  #t = ({ type: t, data: e }, s = [], r) => this.#e ? new Promise((o, R) => {
    const n = h();
    this.#e && this.#e.postMessage({ id: n, type: t, data: e }, s), this.#i[n] = o, this.#E[n] = R, r?.addEventListener("abort", () => {
      R(new DOMException(`Message # ${n} was aborted`, "AbortError"));
    }, { once: !0 });
  }) : Promise.reject(d);
  on(t, e) {
    t === "log" ? this.#s.push(e) : t === "progress" && this.#r.push(e);
  }
  off(t, e) {
    t === "log" ? this.#s = this.#s.filter((s) => s !== e) : t === "progress" && (this.#r = this.#r.filter((s) => s !== e));
  }
  /**
   * Loads ffmpeg-core inside web worker. It is required to call this method first
   * as it initializes WebAssembly and other essential variables.
   *
   * @category FFmpeg
   * @returns `true` if ffmpeg core is loaded for the first time.
   */
  load = ({ classWorkerURL: t, ...e } = {}, { signal: s } = {}) => (this.#e || (this.#e = t ? new Worker(new URL(t, import.meta.url), {
    type: "module"
  }) : (
    // We need to duplicated the code here to enable webpack
    // to bundle worekr.js here.
    new Worker(new URL(
      /* @vite-ignore */
      "/assets/worker-CgGQRANT.js",
      import.meta.url
    ), {
      type: "module"
    })
  ), this.#n()), this.#t({
    type: E.LOAD,
    data: e
  }, void 0, s));
  /**
   * Execute ffmpeg command.
   *
   * @remarks
   * To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
   * by default.
   *
   * @example
   * ```ts
   * const ffmpeg = new FFmpeg();
   * await ffmpeg.load();
   * await ffmpeg.writeFile("video.avi", ...);
   * // ffmpeg -i video.avi video.mp4
   * await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
   * const data = ffmpeg.readFile("video.mp4");
   * ```
   *
   * @returns `0` if no error, `!= 0` if timeout (1) or error.
   * @category FFmpeg
   */
  exec = (t, e = -1, { signal: s } = {}) => this.#t({
    type: E.EXEC,
    data: { args: t, timeout: e }
  }, void 0, s);
  /**
   * Execute ffprobe command.
   *
   * @example
   * ```ts
   * const ffmpeg = new FFmpeg();
   * await ffmpeg.load();
   * await ffmpeg.writeFile("video.avi", ...);
   * // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt
   * await ffmpeg.ffprobe(["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "video.avi", "-o", "output.txt"]);
   * const data = ffmpeg.readFile("output.txt");
   * ```
   *
   * @returns `0` if no error, `!= 0` if timeout (1) or error.
   * @category FFmpeg
   */
  ffprobe = (t, e = -1, { signal: s } = {}) => this.#t({
    type: E.FFPROBE,
    data: { args: t, timeout: e }
  }, void 0, s);
  /**
   * Terminate all ongoing API calls and terminate web worker.
   * `FFmpeg.load()` must be called again before calling any other APIs.
   *
   * @category FFmpeg
   */
  terminate = () => {
    const t = Object.keys(this.#E);
    for (const e of t)
      this.#E[e](D), delete this.#E[e], delete this.#i[e];
    this.#e && (this.#e.terminate(), this.#e = null, this.loaded = !1);
  };
  /**
   * Write data to ffmpeg.wasm.
   *
   * @example
   * ```ts
   * const ffmpeg = new FFmpeg();
   * await ffmpeg.load();
   * await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
   * await ffmpeg.writeFile("text.txt", "hello world");
   * ```
   *
   * @category File System
   */
  writeFile = (t, e, { signal: s } = {}) => {
    const r = [];
    return e instanceof Uint8Array && r.push(e.buffer), this.#t({
      type: E.WRITE_FILE,
      data: { path: t, data: e }
    }, r, s);
  };
  mount = (t, e, s) => {
    const r = [];
    return this.#t({
      type: E.MOUNT,
      data: { fsType: t, options: e, mountPoint: s }
    }, r);
  };
  unmount = (t) => {
    const e = [];
    return this.#t({
      type: E.UNMOUNT,
      data: { mountPoint: t }
    }, e);
  };
  /**
   * Read data from ffmpeg.wasm.
   *
   * @example
   * ```ts
   * const ffmpeg = new FFmpeg();
   * await ffmpeg.load();
   * const data = await ffmpeg.readFile("video.mp4");
   * ```
   *
   * @category File System
   */
  readFile = (t, e = "binary", { signal: s } = {}) => this.#t({
    type: E.READ_FILE,
    data: { path: t, encoding: e }
  }, void 0, s);
  /**
   * Delete a file.
   *
   * @category File System
   */
  deleteFile = (t, { signal: e } = {}) => this.#t({
    type: E.DELETE_FILE,
    data: { path: t }
  }, void 0, e);
  /**
   * Rename a file or directory.
   *
   * @category File System
   */
  rename = (t, e, { signal: s } = {}) => this.#t({
    type: E.RENAME,
    data: { oldPath: t, newPath: e }
  }, void 0, s);
  /**
   * Create a directory.
   *
   * @category File System
   */
  createDir = (t, { signal: e } = {}) => this.#t({
    type: E.CREATE_DIR,
    data: { path: t }
  }, void 0, e);
  /**
   * List directory contents.
   *
   * @category File System
   */
  listDir = (t, { signal: e } = {}) => this.#t({
    type: E.LIST_DIR,
    data: { path: t }
  }, void 0, e);
  /**
   * Delete an empty directory.
   *
   * @category File System
   */
  deleteDir = (t, { signal: e } = {}) => this.#t({
    type: E.DELETE_DIR,
    data: { path: t }
  }, void 0, e);
}
var a;
(function(i) {
  i.MEMFS = "MEMFS", i.NODEFS = "NODEFS", i.NODERAWFS = "NODERAWFS", i.IDBFS = "IDBFS", i.WORKERFS = "WORKERFS", i.PROXYFS = "PROXYFS";
})(a || (a = {}));
export {
  a as FFFSType,
  O as FFmpeg
};
