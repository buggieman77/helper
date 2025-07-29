import * as Helper from "./helper.js";
import App from "./App.js";
import Ajax from "./Ajax.js";

const { createLoader, createAlert, getPrimaryKey } = Helper;
const NovelHelper = { createLoader, createAlert, getPrimaryKey };
const AjaxHelper = { createAlert };

export default App;
export { App, Ajax, NovelHelper, AjaxHelper };
