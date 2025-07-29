export default class App {
  constructor() {
    String.prototype.capitalize = function () {
      if (!this) return "";
      return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    };
    this.instanceScript();
  }

  detectScript() {
    const currentUrl = window.location.href;
    const path = currentUrl.replace(App.baseUrl, "");
    return path.split("/").map((part) => part.capitalize());
  }

  getScriptPath() {
    const baseUrl = App.baseUrl + "public/js/app/script/";
    const parts = this.detectScript();
    const fileName = parts[0] + (parts[1] ?? "") + ".js";

    return baseUrl + fileName;
  }

  getFallbackScriptPath() {
    const baseUrl = App.baseUrl + "public/js/app/script/";
    const filename = this.detectScript()[0] + ".js";
    return baseUrl + filename;
  }

  async instanceScript() {
    const url = this.getScriptPath();

    const fallbackUrl = this.getFallbackScriptPath();
    try {
      const Url = await fetch(url, { method: "HEAD" });
      if (!Url.ok) throw new Error("invalid url");
      const Script = await import(url);
      console.info(Script);
    } catch (error) {
      console.error(url + error);
    }
  }
}
