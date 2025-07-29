export default class App {
  constructor() {
    // this.#instanceScript();
    console.info("oke");
  }

  #getUrlParts() {
    const currentUrl = window.location.href;
    const path = currentUrl.replace(window.path.root, "").split("/");
    return path.map((part) => part.capitalFirst());
  }

  #detectScript() {
    const urlParts = this.#getUrlParts();
    const fileName = urlParts[0] + (urlParts[1] ?? "s") + ".js";
    return window.path.script + fileName;
  }

  async #instanceScript() {
    const detectedScript = this.#detectScript();
    const fallbackScript = window.path.fallbackScriptFile;

    try {
      const { default: Script } = await import(detectedScript.bustCache());
      new Script();
    } catch (error) {
      console.warn("Woops " + error);
    }
  }
}
