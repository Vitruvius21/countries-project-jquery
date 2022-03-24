import * as theme from "./theme.js";
import * as dataService from "./services/dataService.js";
import { transformNumber } from "./utils/utils.js";

theme.defineTheme();

const addr = new URL(window.location.href);
let pagingNumber = 10;

$(document).ready(async function () {
  $(".fadeTo").fadeTo(500, 1);

  let countriesData = addr.href.includes("pages/countries")
    ? await dataService.getAllCountries()
    : await dataService.getAllNonUnTerritories();
  let allCountries = countriesData;

  let maxPageNumber = calcMaxPageNumber();
  const paramsPageNumber = +addr.searchParams.get("page");
  const paramsDefaultPage =
    paramsPageNumber > 0 && paramsPageNumber <= maxPageNumber
      ? paramsPageNumber
      : 1;

  const paginator = $("#paginator");
  let btnsCollection;
  let previousPagingTarget = null;

  $(".loader-img").attr("style", "display:none");

  function calcMaxPageNumber() {
    return Math.ceil(allCountries.length / pagingNumber);
  }

  function createCountryElement(countryData) {
    let countryElements = [];
    let countryElement;

    //* Create country elements
    [
      ["<div></div>", "country fadeTo"],
      ["<img>", "country-flag"],
      ["<h4></h4>", "country-name"],
      ["<p></p>", "country-capital"],
      ["<p></p>", "country-region"],
      ["<p></p>", "country-population"],
    ].forEach((val) => {
      countryElements.push($(val[0]).addClass(val[1]));
    });

    //* Populate country elements
    countryElements[0].attr("title", countryData?.name?.common);
    countryElements[1].attr({
      src: countryData?.flags?.svg,
      alt: `Flag of ${countryData?.name?.common}`,
    });
    countryElements[2].html(countryData?.name?.common);
    countryElements[3].html(
      `<span>Capital:</span> ${countryData?.capital?.join(", ") || "N/A"}`
    );
    countryElements[4].html(
      `<span>Region:</span> ${countryData?.region || "N/A"}`
    );
    countryElements[5].html(
      `<span>Population:</span> ${
        transformNumber(+countryData?.population) || "N/A"
      }`
    );

    //* Populate country element
    for (let index = 1; index < countryElements.length; index++) {
      countryElement = countryElements[0].append(countryElements[index]);
    }

    return countryElement;
  }

  function updateCountriesData(i) {
    $(".countries").empty();

    const countries = allCountries.slice(
      (i - 1) * pagingNumber,
      i * pagingNumber
    );

    countries.forEach((countryData) => {
      const countryEl = createCountryElement(countryData);
      countryEl.click(navigate.bind($, countryEl[0].title));
      $(".countries").append(countryEl);
    });

    $(".fadeTo").fadeTo(300, 1);
  }

  function updateHrefParams(i) {
    addr.searchParams.set("page", i);
    window.history.pushState({ path: addr.href }, "", addr.href);
  }

  function updatePaginator() {
    for (let index = 1; index <= maxPageNumber; index++) {
      const btn = $("<button></button>").html(index);
      paginator.append(btn);

      btn.click((event) => {
        for (const button of btnsCollection) {
          $(button).removeClass("navigation__active-btn");
        }
        $(event.target).addClass("navigation__active-btn");

        //* check for duplicate click
        if (event.target !== previousPagingTarget) {
          updateCountriesData(index);
          updateHrefParams(index);
        }
        previousPagingTarget = event.target;
      });
    }

    btnsCollection = $("#paginator button");
    $(btnsCollection[paramsDefaultPage - 1]).addClass("navigation__active-btn");
  }

  //* Navigation
  function navigate(countryName) {
    const navAddr = new URL(window.location.origin);
    navAddr.pathname = "pages/profile.html";
    navAddr.searchParams.set("country", countryName);

    window.location.assign(navAddr);
  }

  $(window).on("popstate", (event) => {
    const found = +event?.state?.path.match(/page=\d+/g)[0].split("=")[1];

    if (found) {
      for (const button of btnsCollection) {
        $(button).removeClass("navigation__active-btn");
      }

      $(btnsCollection[found - 1]).addClass("navigation__active-btn");
    }

    updateCountriesData(found || 1);
  });

  updatePaginator();
  updateCountriesData(paramsDefaultPage);
  updateHrefParams(paramsDefaultPage);

  //* Filters *************************************************************
  function onFilter({ event, value, continents, countries }) {
    const searchValue =
      event?.target?.value.toLowerCase() || value?.toLowerCase() || "";

    allCountries = countriesData.filter((country) => {
      if (countries) {
        continentSearch.value = "";
        return country.name.common.toLowerCase().includes(searchValue);
      } else if (continents) {
        countrySearch.value = "";
        let result;
        country.continents.forEach((val) => {
          result = val.toLowerCase().includes(searchValue);
        });

        return result;
      }
    });

    paginator.empty();
    maxPageNumber = calcMaxPageNumber();
    updatePaginator();
    updateCountriesData(paramsDefaultPage);
    updateHrefParams(1);
  }

  const countrySearch = $("#country-search");
  const continentSearch = $("#continent-search");

  //* Auto-Filter by, when back from profile
  if (countrySearch.val().length > 0) {
    onFilter({ value: countrySearch.val(), countries: true });
  } else if (continentSearch.val().length > 0) {
    onFilter({ value: continentSearch.val(), continents: true });
  }

  //* Filter by, when typing
  $("#country-search").on("input", (event) => {
    onFilter({ event, countries: true });
  });
  $("#continent-search").on("input", (event) => {
    onFilter({ event, continents: true });
  });
});
