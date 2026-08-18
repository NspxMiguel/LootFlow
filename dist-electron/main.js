import { BrowserWindow, Menu, app, ipcMain, shell } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region electron/main.ts
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var SITE = "https://www.nspx.dev/LootFlow/app/";
var APP_URL = app.isPackaged ? SITE : "http://localhost:5173/app/";
var AUTH_URL = app.isPackaged ? `${SITE}?electron-auth=1` : "http://localhost:5173/app/?electron-auth=1";
var ICON = app.isPackaged ? path.join(process.resourcesPath, "build-assets/icon-512.png") : path.join(__dirname, "../build-assets/icon-512.png");
app.commandLine.appendSwitch("use-mock-keychain");
if (!app.requestSingleInstanceLock()) app.quit();
var win = null;
function handleDeepLink(url) {
	try {
		const u = new URL(url);
		if (u.host === "auth") {
			const idToken = u.searchParams.get("idToken");
			const accessToken = u.searchParams.get("accessToken");
			if (idToken && win) {
				win.webContents.send("auth:credential", {
					idToken,
					accessToken
				});
				if (win.isMinimized()) win.restore();
				win.focus();
			}
		}
	} catch (e) {
		console.error("[deep-link] parse error:", e);
	}
}
if (process.defaultApp) {
	if (process.argv.length >= 2) app.setAsDefaultProtocolClient("lootflow", process.execPath, [path.resolve(process.argv[1])]);
} else app.setAsDefaultProtocolClient("lootflow");
app.on("second-instance", (_event, commandLine) => {
	if (win) {
		if (win.isMinimized()) win.restore();
		win.focus();
	}
	const url = commandLine.find((arg) => arg.startsWith("lootflow://"));
	if (url) handleDeepLink(url);
});
app.on("open-url", (_event, url) => {
	handleDeepLink(url);
});
ipcMain.handle("auth:open-browser", () => {
	shell.openExternal(AUTH_URL);
});
function createWindow() {
	win = new BrowserWindow({
		title: "LootFlow",
		width: 1280,
		height: 800,
		minWidth: 900,
		minHeight: 600,
		icon: ICON,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			sandbox: false,
			backgroundThrottling: false,
			preload: path.join(__dirname, "preload.js")
		}
	});
	win.loadURL(APP_URL);
}
app.whenReady().then(() => {
	Menu.setApplicationMenu(null);
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
//#endregion
export {};
