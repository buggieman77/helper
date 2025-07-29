import * as Helper from "./helper.js";
import App from "./App.js";
import Ajax from "./Ajax.js";

const { createLoader, createAlert, getPrimaryKey } = Helper;
const NovelHelper = { createLoader, createAlert, getPrimaryKey };
const AjaxHelper = { createAlert };

window.getBaseUrl = App.baseUrl;
window.getModules = async () => {
  const modules = await import(
    "http://localhost/tutorial/pertemuan21/public/js/app/modules/init.js"
  );
  return modules;
};

export default App;
export { App, Ajax, NovelHelper, AjaxHelper };
