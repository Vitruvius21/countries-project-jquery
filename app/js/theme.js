export function defineTheme() {
  const body = $("body");
  const btnIcon = $(".btn-toggle");

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme == "dark") {
    btnIcon.addClass("btn-toggle-dark");
    body.toggleClass("dark-theme");
  } else if (currentTheme == "light") {
    btnIcon.addClass("btn-toggle-light");
    body.toggleClass("light-theme");
  }

  if (prefersDarkScheme && prefersDarkScheme?.matches) {
    btnIcon.addClass("btn-toggle-dark");
  }

  $(".theme__btn-container").on("click", function () {
    let theme;

    btnIcon.addClass("btn-toggle-dark").toggleClass("btn-toggle-light");

    if (prefersDarkScheme && prefersDarkScheme?.matches) {
      body.removeClass("dark-theme").toggleClass("light-theme");
      theme = body.hasClass("light-theme") ? "light" : "dark";
    } else {
      body.toggleClass("light-theme");
      theme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    }

    localStorage.setItem("theme", theme);
  });
}
