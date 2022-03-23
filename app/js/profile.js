import * as theme from "./theme.js";
import { getAllCountriesAndTerritories } from "./services/dataService.js";
import { loadGoogleMap } from "./services/googleMapService.js";
import { transformNumber, inPluralOrSingular } from "./utils/utils.js";

theme.defineTheme();

const addr = new URL(window.location.href);
const countryName = addr.searchParams.get("country");

window.onload = async function () {
  const countries = !localStorage.getItem("countries")
    ? await getAllCountriesAndTerritories()
    : JSON.parse(localStorage.getItem("countries"));

  const country = countries.find((cntr) => cntr.name.common === countryName);

  if (!localStorage.getItem("countries")) {
    localStorage.setItem("countries", JSON.stringify(countries));
  }

  function onPageLoad() {
    document
      .querySelector(".main__data")
      .setAttribute(
        "style",
        "justify-content: space-between; align-items: unset; "
      );
    document.querySelector(".main__data-graphics").removeAttribute("style");
    document.querySelector(".main__data-text").removeAttribute("style");
    document
      .querySelector(".loader-img")
      .setAttribute("style", "display: none");
  }

  function loadFlag(el, countryData) {
    if (el.classList.contains("country-flag-img")) {
      el.setAttribute("src", countryData?.flags?.svg);
      el.setAttribute("alt", "Flag of " + countryData?.name?.common);
      el.setAttribute("title", "Flag of " + countryData?.name?.common);
    }
  }

  function loadNames(el, countryData) {
    if (el.classList.contains("main__data-name")) {
      el.innerText = countryData?.name?.common || "N/A";
    } else if (el.classList.contains("main__data-name-native")) {
      const nativeNames = [];

      Object.keys(countryData?.name?.nativeName).forEach((key) => {
        nativeNames.push(countryData?.name?.nativeName[key]?.common);
      });

      el.setAttribute("title", nativeNames.join(", ") || "N/A");
      el.innerHTML = `<span>Native ${inPluralOrSingular(
        "Name",
        nativeNames.length
      )}:</span> ${nativeNames.join(", ") || "N/A"}`;
    }
  }

  function loadCurrency(el, countryData) {
    if (el.classList.contains("main__data-currnecy")) {
      const currencies = [];
      if (countryData?.currencies) {
        Object.keys(countryData?.currencies).forEach((key) => {
          currencies.push(
            `${countryData?.currencies[key].name} (${countryData?.currencies[key].symbol})`
          );
        });
      }
      el.innerHTML = `<span>${inPluralOrSingular(
        "Currency",
        currencies.length
      )}:</span> ${currencies.join(", ") || "N/A"}`;
    }
  }

  function loadLanguageAndDomain(el, countryData) {
    if (el.classList.contains("main__data-domain")) {
      el.innerHTML = `<span>Top Level ${inPluralOrSingular(
        "Domain",
        countryData?.tld.length
      )}:</span> ${countryData?.tld.join(" ") || "N/A"}`;
    } else if (el.classList.contains("main__data-language")) {
      const languages = Object.values(countryData?.languages);

      el.setAttribute("title", languages.join(", ") || "N/A");
      el.innerHTML = `<span>${inPluralOrSingular(
        "Language",
        languages.length
      )}:</span> ${languages.join(", ") || "N/A"}`;
    }
  }

  function loadNeighbors(el, countryData) {
    if (el.classList.contains("main__data-neighbors")) {
      const neighborNames = countries
        .filter((neighbor) => countryData?.borders?.includes(neighbor.cca3))
        .map((neighbor) => neighbor.name.common);

      el.innerHTML = `<span>${inPluralOrSingular(
        "Neighbor",
        neighborNames.length
      )}: </span>${!neighborNames.length ? "None" : ""}`;

      neighborNames.forEach((neighborName) => {
        const btn = document.createElement("button");

        btn.innerHTML = neighborName;
        btn.addEventListener("click", () => {
          window.location.href = `./profile.html?country=${neighborName}`;
        });

        el.appendChild(btn);
      });
    }
  }

  function loadProfileData(countryData) {
    document.querySelectorAll(".with-data").forEach((el) => {
      loadFlag(el, countryData);
      loadNames(el, countryData);
      loadCurrency(el, countryData);
      loadLanguageAndDomain(el, countryData);
      loadNeighbors(el, countryData);

      if (el.classList.contains("main__data-population")) {
        el.innerHTML = `<span>Population:</span> ${
          transformNumber(+countryData?.population) || "N/A"
        }`;
      } else if (el.classList.contains("main__data-region")) {
        el.innerHTML = `<span>Region:</span> ${countryData?.region}`;
      } else if (el.classList.contains("main__data-subregion")) {
        el.innerHTML = `<span>Sub Region:</span> ${
          countryData?.subregion || "N/A"
        }`;
      } else if (el.classList.contains("main__data-capital")) {
        el.innerHTML = `<span>Capital:</span> ${
          countryData?.capital?.[0] || "N/A"
        }`;
      } else if (el.classList.contains("main__data-unmember")) {
        el.innerHTML = `<span>UN member:</span> ${
          countryData?.unMember ? "Yes" : "No"
        }`;
      } else if (el.classList.contains("main__data-start-of-week")) {
        const weekDay = countryData?.startOfWeek;
        el.innerHTML = `<span>Start of week:</span> ${
          weekDay.charAt(0).toUpperCase() + weekDay.slice(1) || "N/A"
        }`;
      } else if (el.classList.contains("main__data-timezones")) {
        const timezones = countryData?.timezones.join(" ");
        el.setAttribute("title", timezones);
        el.innerHTML = `<span>${inPluralOrSingular(
          "Timezone",
          countryData?.timezones.length
        )}:</span> ${timezones || "N/A"}`;
      } else if (el.classList.contains("main__data-landlocked")) {
        el.innerHTML = `<span>Landlocked:</span> ${
          countryData?.landlocked ? "Yes" : "No"
        }`;
      }
    });
  }

  loadGoogleMap(country, "gmap_canvas");
  loadProfileData(country);
  onPageLoad();
};
