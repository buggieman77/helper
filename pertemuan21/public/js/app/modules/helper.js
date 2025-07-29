export const createLoader = () => {
  const span = document.createElement("span");
  const spinner = document.createElement("div");
  const flexbox = document.createElement("div");

  span.className = "visually-hidden";
  span.textContent = "loading";

  spinner.className = "spinner-border text-light";
  spinner.setAttribute("role", "status");

  flexbox.className = "d-flex justify-content-center";

  flexbox.appendChild(spinner);
  spinner.appendChild(span);

  return flexbox.outerHTML;
};

export const createAlert = (type, message, forModal = true) => {
  if (forModal) {
    return `
    <div class="modal-content">
      <div class="alert alert-${type} alert-dismissible fade show w-100 mb-0" role="alert">
        <h4><strong>${message}</strong></h4>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
    </div>
  `;
  } else {
    return `
    <div class="alert alert-${type} alert-dismissible fade show w-100 mb-0" role="alert">
      <h4><strong>${message}</strong></h4>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    `;
  }
};

export const getPrimaryKey = (button) => {
  let primaryKey = {};
  let input = button.nextElementSibling;

  while (input) {
    if (input.tagName === "INPUT") primaryKey[input.name] = input.value;
    input = input.nextElementSibling;
  }

  return primaryKey;
};

export const getModules = async () => {
  const modules = await import(
    "http://localhost/tutorial/pertemuan21/public/js/app/modules/init.js"
  );
  return modules;
};
