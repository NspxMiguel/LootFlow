import { app as e, ipcMain as h, shell as u, Menu as f, BrowserWindow as c } from "electron";
import { fileURLToPath as w } from "node:url";
import s from "node:path";
const l = s.dirname(w(import.meta.url)), p = "https://www.nspx.dev/LootFlow/app/", m = e.isPackaged ? p : "http://localhost:5173/app/", g = e.isPackaged ? `${p}?electron-auth=1` : "http://localhost:5173/app/?electron-auth=1", k = e.isPackaged ? s.join(process.resourcesPath, "build-assets/icon-512.png") : s.join(l, "../build-assets/icon-512.png");
e.commandLine.appendSwitch("use-mock-keychain");
const P = e.requestSingleInstanceLock();
P || e.quit();
let o = null;
function d(i) {
  try {
    const t = new URL(i);
    if (t.host === "auth") {
      const n = t.searchParams.get("idToken"), a = t.searchParams.get("accessToken");
      n && o && (o.webContents.send("auth:credential", { idToken: n, accessToken: a }), o.isMinimized() && o.restore(), o.focus());
    }
  } catch (t) {
    console.error("[deep-link] parse error:", t);
  }
}
process.defaultApp ? process.argv.length >= 2 && e.setAsDefaultProtocolClient("lootflow", process.execPath, [s.resolve(process.argv[1])]) : e.setAsDefaultProtocolClient("lootflow");
e.on("second-instance", (i, t) => {
  o && (o.isMinimized() && o.restore(), o.focus());
  const n = t.find((a) => a.startsWith("lootflow://"));
  n && d(n);
});
e.on("open-url", (i, t) => {
  d(t);
});
h.handle("auth:open-browser", () => {
  u.openExternal(g);
});
function r() {
  o = new c({
    title: "LootFlow",
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: k,
    autoHideMenuBar: !0,
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      // sandbox: false is required for ESM preload scripts (import syntax) to
      // work correctly. Electron v20+ defaults sandbox to true, which breaks
      // ESM module loading in the preload — contextBridge.exposeInMainWorld
      // never runs and window.electronAPI stays undefined in the renderer.
      sandbox: !1,
      backgroundThrottling: !1,
      preload: s.join(l, "preload.js")
    }
  }), o.loadURL(m);
}
e.whenReady().then(() => {
  f.setApplicationMenu(null), r(), e.on("activate", () => {
    c.getAllWindows().length === 0 && r();
  });
});
e.on("window-all-closed", () => {
  process.platform !== "darwin" && e.quit();
});
