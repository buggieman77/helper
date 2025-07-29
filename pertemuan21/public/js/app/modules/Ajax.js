export default class Ajax {
  #xhr;
  #timeout = 5000;

  constructor() {
    this.#xhr = new XMLHttpRequest();
  }

  set timeout(value) {
    this.#timeout = parseInt(value);
  }

  fetchData(method, destination, data = null) {
    let url = getBaseUrl + destination;

    if (data && method.toUpperCase() == "GET") {
      url += this.#setGetRequest(data);
    } else {
      data = this.#setPostRequest(data);
    }
    console.info(url);
    return new Promise(this.#promiseHandler(method, url, data));
  }

  #promiseHandler = (method, url, data) => (resolve, reject) => {
    this.#setXhrCallback(this.#xhr, resolve, reject);
    this.#xhr.open(method, url);
    this.#xhr.send(data);
  };

  setInnerHtmlCallback = async (element) => {
    const { AjaxHelper } = await getModules();
    const resolve = (response) => {
      element.innerHTML = response;
    };
    const reject = (message) => {
      element.innerHTML = AjaxHelper.createAlert("danger", message);
    };
    return [resolve, reject];
  };

  #appendData = (method, object) => {
    const get = method.toUpperCase() === "GET";
    const data = get ? new URLSearchParams() : new FormData();

    const recursiveAppend = (obj, prefix = "") => {
      for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
        const value = obj[key];
        const paramKey = prefix ? `${prefix}[${key}]` : key;
        const nested = typeof value === "object" && value !== null;
        nested
          ? recursiveAppend(value, paramKey)
          : data.append(paramKey, value);
      }
    };
    recursiveAppend(object);

    return get ? "&" + data.toString() : data;
  };

  #setPostRequest = (object) => {
    return this.#appendData("post", object);
  };
  #setGetRequest = (object) => {
    return this.#appendData("get", object);
  };

  #onloadHandler = (xhr, resolve, reject) => () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      resolve(xhr.responseText);
    } else {
      reject("Request failed, status " + xhr.status);
    }
  };

  #onProgressHandler = (event) => {
    if (event.lengthComputable) {
      const percent = Math.floor((event.loaded / event.total) * 100);
      console.info(`Progress : ${percent}%`);
    } else {
      console.info(`Received : ${event.loaded} bytes`);
    }
  };

  #setXhrCallback = (xhr, success, failed) => {
    xhr.progress = this.#onProgressHandler;
    xhr.onload = this.#onloadHandler(xhr, success, failed);
    xhr.onerror = () => console.error("Request error");
    xhr.onabort = () => failed("Request aborted by user");
    xhr.ontimeout = () => failed("Request timed out, try later");
  };
}
