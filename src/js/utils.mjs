export function getParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  clear = true,
  position = "beforeend"
) {
  if (!parentElement || !Array.isArray(list)) {
    return;
  }

  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map((item) => templateFn(item));
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function normalizeExternalImageUrl(url, fallback = "") {
  const trimmed = (url || "").trim();

  if (!trimmed) {
    return fallback;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  if (trimmed.startsWith("http://")) {
    return `https://${trimmed.slice("http://".length)}`;
  }

  return trimmed;
}
