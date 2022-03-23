import * as theme from "./theme.js";
import * as dataService from "./services/dataService.js";
import { transformNumber } from "./utils/utils.js";

theme.defineTheme();

const addr = new URL(window.location.href);
let pagingNumber = 10;

window.onload = async function () {
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

  const loaderImg = document.querySelector(".loader-img");
  const paginator = document.getElementById("paginator");
  let btnsCollection;
  let previousPagingTarget = null;

  loaderImg.setAttribute("style", "display:none");

  function calcMaxPageNumber() {
    return Math.ceil(allCountries.length / pagingNumber);
  }

  function createCountryElement(countryData) {
    let countryElsArray = [];
    let countryEl;

    [
      ["div", "country"],
      ["img", "country-flag"],
      ["h4", "country-name"],
      ["p", "country-capital"],
      ["p", "country-region"],
      ["p", "country-population"],
    ].forEach((val) => {
      let countryInnerEl = document.createElement(val[0]);
      countryInnerEl.classList.add(val[1]);
      countryElsArray.push(countryInnerEl);
    });

    countryElsArray[0].setAttribute("title", countryData?.name?.common);
    countryElsArray[1].setAttribute("src", countryData?.flags?.svg);
    countryElsArray[1].setAttribute(
      "alt",
      "Flag of " + countryData?.name?.common
    );
    countryElsArray[2].innerHTML = countryData?.name?.common;
    countryElsArray[3].innerHTML = `<span>Capital:</span> ${
      countryData?.capital?.join(", ") || "N/A"
    }`;
    countryElsArray[4].innerHTML = `<span>Region:</span> ${
      countryData?.region || "N/A"
    }`;
    countryElsArray[5].innerHTML = `<span>Population:</span> ${
      transformNumber(+countryData?.population) || "N/A"
    }`;

    for (let index = 1; index < countryElsArray.length; index++) {
      countryEl = countryElsArray[0];
      countryEl.appendChild(countryElsArray[index]);
    }

    return countryEl;
  }

  function updateCountriesData(i) {
    const countries = allCountries.slice(
      (i - 1) * pagingNumber,
      i * pagingNumber
    );

    const countriesContainer = document.querySelector(".countries");
    countriesContainer.innerHTML = "";

    countries.forEach((countryData, index) => {
      const countryEl = createCountryElement(countryData);
      countryEl.addEventListener(
        "click",
        navigate.bind(null, [countryEl.title])
      );
      countriesContainer.append(countryEl);
    });
  }

  function updateHrefParams(i) {
    addr.searchParams.set("page", i);
    window.history.pushState({ path: addr.href }, "", addr.href);
  }

  function updatePaginator() {
    // paginator.innerHTML = "";
    for (let index = 1; index <= maxPageNumber; index++) {
      const btn = document.createElement("button");
      btn.innerHTML = `${index}`;
      paginator.append(btn);

      btn.addEventListener("click", (event) => {
        for (const button of btnsCollection) {
          button.classList.remove("navigation__active-btn");
        }
        event.target.classList.add("navigation__active-btn");

        //* check for duplicate click
        if (event.target !== previousPagingTarget) {
          updateCountriesData(index);
          updateHrefParams(index);
        }
        previousPagingTarget = event.target;
      });
    }

    btnsCollection = paginator.getElementsByTagName("button");
    btnsCollection[paramsDefaultPage - 1]?.classList.add(
      "navigation__active-btn"
    );
  }

  //* Navigation
  function navigate(countryName) {
    const navAddr = new URL(window.location.origin);
    navAddr.pathname = "pages/profile.html";
    navAddr.searchParams.set("country", countryName);

    window.location.assign(navAddr);
  }

  window.addEventListener(
    "popstate",
    (event) => {
      const found = +event?.state?.path.match(/page=\d+/g)[0].split("=")[1];

      if (found) {
        for (const button of btnsCollection) {
          button.classList.remove("navigation__active-btn");
        }

        btnsCollection[found - 1]?.classList.add("navigation__active-btn");
      }

      updateCountriesData(found || 1);
    },
    false
  );

  updatePaginator();
  updateCountriesData(paramsDefaultPage);
  updateHrefParams(paramsDefaultPage);

  //* Filters *************************************************************
  function onFilter({ event, value, continents, countries }) {
    const searchValue =
      event?.target?.value.toLowerCase() || value?.toLowerCase() || "";

    allCountries = countriesData.filter((country) => {
      if (countries) {
        return country.name.common.toLowerCase().includes(searchValue);
      } else if (continents) {
        let result;
        country.continents.forEach((val) => {
          result = val.toLowerCase().includes(searchValue);
        });

        return result;
      }
    });

    paginator.innerHTML = "";
    maxPageNumber = calcMaxPageNumber();
    updatePaginator();
    updateCountriesData(paramsDefaultPage);
    updateHrefParams(1);
  }

  const countrySearch = document.getElementById("country-search");
  const continentSearch = document.getElementById("continent-search");

  if (countrySearch.value.length > 0) {
    onFilter({ value: countrySearch.value, countries: true });
  } else if (continentSearch.value.length > 0) {
    onFilter({ value: continentSearch.value, continents: true });
  }

  countrySearch.addEventListener("input", (event) => {
    continentSearch.value = "";
    onFilter({ event, countries: true });
  });

  continentSearch.addEventListener("input", (event) => {
    countrySearch.value = "";
    onFilter({ event, continents: true });
  });
};
