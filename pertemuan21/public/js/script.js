await import("./app/config/path.js");
const appUrl = Path.bustCache(Path.getAppUrl);

try {
  const Url = await fetch(appUrl, { method: "HEAD", cache: "no-cache" });
  if (!Url.ok) throw new Error("invalid url");
  const { default: App } = await import(appUrl);
  new App();
} catch (error) {
  console.warn(appUrl + " " + error);
}
