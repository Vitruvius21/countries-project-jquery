import * as theme from "./theme.js";
import { getAllCountriesAndTerritories } from "./services/dataService.js";
import { loadGoogleMap } from "./services/googleMapService.js";
import { transformNumber, inPluralOrSingular } from "./utils/utils.js";

theme.defineTheme();

const addr = new URL(window.location.href);
const countryName = addr.searchParams.get("country");

$(document).ready(async function () {
  $(".fadeTo").fadeTo(500, 1);

  const countries = !localStorage.getItem("countries")
    ? await getAllCountriesAndTerritories()
    : JSON.parse(localStorage.getItem("countries"));

  const country = countries.find((cntr) => cntr.name.common === countryName);

  if (!localStorage.getItem("countries")) {
    localStorage.setItem("countries", JSON.stringify(countries));
  }

  function onPageLoad() {
    $(".main__data").attr(
      "style",
      "justify-content: space-between; align-items: unset;"
    );
    $(".main__data-graphics").removeAttr("style");
    $(".main__data-text").removeAttr("style");
    $(".loader-img").attr("style", "display: none");
  }

  function loadFlag(el, countryData) {
    if ($(el).hasClass("country-flag-img")) {
      $(el).attr({
        src: countryData?.flags?.svg,
        alt: "Flag of " + countryData?.name?.common,
        title: "Flag of " + countryData?.name?.common,
      });
    }
  }

  function loadNames(el, countryData) {
    if ($(el).hasClass("main__data-name")) {
      $(el).html(countryData?.name?.common || "N/A");
    } else if ($(el).hasClass("main__data-name-native")) {
      const nativeNames = [];

      if (countryData?.name?.nativeName) {
        Object.keys(countryData?.name?.nativeName).forEach((key) => {
          nativeNames.push(countryData?.name?.nativeName[key]?.common);
        });
      }

      $(el)
        .attr("title", nativeNames.join(", ") || "N/A")
        .html(
          `<span>Native ${inPluralOrSingular(
            "Name",
            nativeNames.length
          )}:</span> ${nativeNames.join(", ") || "N/A"}`
        );
    }
  }

  function loadCurrency(el, countryData) {
    if ($(el).hasClass("main__data-currnecy")) {
      const currencies = [];
      if (countryData?.currencies) {
        Object.keys(countryData?.currencies).forEach((key) => {
          currencies.push(
            `${countryData?.currencies[key].name} (${countryData?.currencies[key].symbol})`
          );
        });
      }
      $(el).html(
        `<span>${inPluralOrSingular("Currency", currencies.length)}:</span> ${
          currencies.join(", ") || "N/A"
        }`
      );
    }
  }

  function loadLanguageAndDomain(el, countryData) {
    if ($(el).hasClass("main__data-domain")) {
      $(el).html(
        `<span>Top Level ${inPluralOrSingular(
          "Domain",
          countryData?.tld.length
        )}:</span> ${countryData?.tld.join(" ") || "N/A"}`
      );
    } else if ($(el).hasClass("main__data-language")) {
      const languages =
        countryData?.languages && Object.values(countryData?.languages);

      $(el)
        .attr("title", languages?.join(", ") || "N/A")
        .html(
          `<span>${inPluralOrSingular("Language", languages?.length)}:</span> ${
            languages?.join(", ") || "N/A"
          }`
        );
    }
  }

  function loadNeighbors(el, countryData) {
    if ($(el).hasClass("main__data-neighbors")) {
      const neighborNames = countries
        .filter((neighbor) => countryData?.borders?.includes(neighbor.cca3))
        .map((neighbor) => neighbor.name.common);

      $(el).html(
        `<span>${inPluralOrSingular(
          "Neighbor",
          neighborNames.length
        )}: </span>${!neighborNames.length ? "None" : ""}`
      );

      neighborNames.forEach((neighborName) => {
        $("<button></button>")
          .html(neighborName)
          .click(() => {
            window.location.href = `./profile.html?country=${neighborName}`;
          })
          .appendTo(el);
      });
    }
  }

  function loadProfileData(countryData) {
    $(".with-data").each(function (i, el) {
      loadFlag(el, countryData);
      loadNames(el, countryData);
      loadCurrency(el, countryData);
      loadLanguageAndDomain(el, countryData);
      loadNeighbors(el, countryData);

      if ($(el).hasClass("main__data-population")) {
        $(el).html(
          `<span>Population:</span> ${
            transformNumber(+countryData?.population) || "N/A"
          }`
        );
      } else if ($(el).hasClass("main__data-region")) {
        $(el).html(`<span>Region:</span> ${countryData?.region}`);
      } else if ($(el).hasClass("main__data-subregion")) {
        $(el).html(
          `<span>Sub Region:</span> ${countryData?.subregion || "N/A"}`
        );
      } else if ($(el).hasClass("main__data-capital")) {
        $(el).html(
          `<span>Capital:</span> ${countryData?.capital?.[0] || "N/A"}`
        );
      } else if ($(el).hasClass("main__data-unmember")) {
        $(el).html(
          `<span>UN member:</span> ${countryData?.unMember ? "Yes" : "No"}`
        );
      } else if ($(el).hasClass("main__data-start-of-week")) {
        const weekDay = countryData?.startOfWeek;
        $(el).html(
          `<span>Start of week:</span> ${
            weekDay.charAt(0).toUpperCase() + weekDay.slice(1) || "N/A"
          }`
        );
      } else if ($(el).hasClass("main__data-timezones")) {
        const timezones = countryData?.timezones.join(" ");
        $(el)
          .attr("title", timezones)
          .html(
            `<span>${inPluralOrSingular(
              "Timezone",
              countryData?.timezones.length
            )}:</span> ${timezones || "N/A"}`
          );
      } else if ($(el).hasClass("main__data-landlocked")) {
        $(el).html(
          `<span>Landlocked:</span> ${countryData?.landlocked ? "Yes" : "No"}`
        );
      }
    });
  }

  loadGoogleMap(country, "gmap_canvas");
  loadProfileData(country);
  onPageLoad();
});
