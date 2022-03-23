export function defineTheme() {
  const btn = document.querySelector(".theme__btn-container");
  const btnIcon = document.querySelector(".btn-toggle");

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme == "dark") {
    btnIcon?.classList.add("btn-toggle-dark");
    document.body.classList.toggle("dark-theme");
  } else if (currentTheme == "light") {
    btnIcon?.classList.add("btn-toggle-light");
    document.body.classList.toggle("light-theme");
  }

  if (prefersDarkScheme && prefersDarkScheme?.matches) {
    btnIcon?.classList.add("btn-toggle-dark");
  }

  btn?.addEventListener("click", function () {
    let theme;

    btnIcon?.classList.add("btn-toggle-dark");
    btnIcon?.classList.toggle("btn-toggle-light");

    if (prefersDarkScheme && prefersDarkScheme?.matches) {
      document.body.classList.remove("dark-theme");
      document.body.classList.toggle("light-theme");

      theme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";
    } else {
      document.body.classList.toggle("dark-theme");
      theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    }

    localStorage.setItem("theme", theme);
  });
}
