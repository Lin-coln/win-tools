window.addEventListener("DOMContentLoaded", (event) => {
  setContentSecurityPolicy();

  injectDefaultCSS();
});

// https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
function setContentSecurityPolicy() {
  let meta = document.head.querySelector(
    `meta[http-equiv="Content-Security-Policy"]`,
  );
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("http-equiv", "Content-Security-Policy");
    document.head.append(meta);
  }

  meta.setAttribute(
    "content",
    `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`,
  );
}

function injectDefaultCSS() {
  const identifier = "electron-default-css";

  let css = document.head.querySelector(`style[${identifier}]`);
  if (!css) {
    css = document.createElement("style");
    css.setAttribute("type", "text/css");
    css.setAttribute(identifier, "");
    document.head.append(css);
  }

  Array.from(css.childNodes).forEach((child) => css.removeChild(child));
  css.appendChild(
    document.createTextNode(
      genCssContent()
        .split("\n")
        .map((x) => x.slice(Math.min(x.length, 4)))
        .join("\n"),
    ),
  );

  function genCssContent() {
    return `
    /* electron */
    body {
      -webkit-app-region: drag;
      & > * {
        -webkit-app-region: no-drag;
      }
    }
    * {
      user-select: none;
    }
    `;
  }
}
