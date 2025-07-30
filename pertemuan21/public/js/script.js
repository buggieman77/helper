// await import("./app/utils/string-utils.js?t=" + Date.now());
// await import("./app/config/path.js".bustCache());
// await import(window.path.requestFile.bustCache());
// const appUrl = window.path.appFile;

// try {
//   const appFile = await window.request.headValidation(appUrl);
//   const { default: App } = await import(appFile.bustCache());
//   new App();
// } catch (error) {
//   console.warn("woops " + error);
// }

const getDirectory = async (url) => {
  const path = await import("path");
  const { fileURLToPath } = await import("url");
  const dirname = path.dirname(fileURLToPath(url));
  const scriptDir = path.join(dirname, "./app/script");
  const detectScript = path.resolve("./app/script/index.js");
  return detectScript;
};

const detectedScript = await getDirectory(import.meta.url);

const checkFile = async (file) => {
  const { access } = await import("fs/promises");
  try {
    await access(file);
    console.info("ads nih");
  } catch {
    console.warn(file + " gaada");
  }
};
const { existsSync } = await import("fs");
existsSync(detectedScript) ? console.info("eksis nih") : console.info("kosong");
// checkFile(detectedScript);
console.info(detectedScript);
