await import("./app/utils/string-utils.js?t=" + Date.now());
await import("./app/config/path.js".bustCache());
await import(window.path.requestFile.bustCache());
const appUrl = window.path.appFile;

try {
  const appFile = await window.request.headValidation(appUrl);
  const { default: App } = await import(appFile.bustCache());
  new App();
} catch (error) {
  console.warn("woops " + error);
}
