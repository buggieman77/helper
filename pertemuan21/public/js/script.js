window.bustCache = (url) => url + "?t=" + Date.now();
window.getBaseUrl = "http://localhost/tutorial/pertemuan21/";
window.getInitUrl = bustCache(getBaseUrl + "public/js/app/modules/init.js");

try {
  const Url = await fetch(getInitUrl, { method: "HEAD", cache: "no-cache" });
  if (!Url.ok) throw new Error("invalid url");
  const { App } = await import(getInitUrl);
  new App();
} catch (error) {
  console.error(getInitUrl + error);
}
