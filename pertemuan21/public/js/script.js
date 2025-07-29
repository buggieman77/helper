import { getInitUrl } from "./app/config/config";

try {
  const Url = await fetch(getInitUrl, { method: "HEAD", cache: "no-cache" });
  if (!Url.ok) throw new Error("invalid url");
  const { App } = await import(getInitUrl);
  new App();
} catch (error) {
  console.error(getInitUrl + error);
}
