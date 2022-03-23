import * as theme from "./theme.js";
import * as dataService from "./services/dataService.js";
import { getRndInteger, createDescription } from "./utils/utils.js";

theme.defineTheme();

window.onload = async function () {
  const allCountries = await dataService.getAllCountries();
  let rndCountry;

  const loaderImg = document.querySelector(".loader-img");
  const card = document.querySelector(".main__section-card");
  const cardTitle = document.createElement("h2");
  const imgContainer = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardText = document.createElement("p");

  loaderImg.setAttribute("style", "display:none");
  cardTitle.className = "main__section-card-heading";
  imgContainer.className = "shadow";
  cardImg.className = "main__section-card-img";
  cardText.className = "main__section-card-text";

  function updateCardData() {
    const rndIndex = getRndInteger({ max: allCountries.length });
    rndCountry = allCountries[rndIndex];

    cardTitle.innerHTML = rndCountry?.name?.common;
    cardImg.src = rndCountry?.flags?.svg;
    cardImg.alt = `${rndCountry?.name?.common} flag`;

    cardText.innerHTML = createDescription(rndCountry);

    imgContainer.append(cardImg);
    card.append(cardTitle, imgContainer, cardText);
  }

  const randomiseBtn = document.getElementById("rand");
  randomiseBtn.addEventListener("click", updateCardData);

  updateCardData();

  //* Navigation
  function navigate() {
    const addr = new URL(window.location.origin);
    addr.pathname = "pages/profile.html";
    addr.searchParams.set("country", rndCountry.name.common);

    window.location.assign(addr);
  }

  card.addEventListener("click", navigate);
};
