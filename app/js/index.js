import * as theme from "./theme.js";
import * as dataService from "./services/dataService.js";
import { getRndInteger, createDescription } from "./utils/utils.js";

theme.defineTheme();

$(document).ready(async function () {
  $(".fadeTo").fadeTo(500, 1);

  const allCountries = await dataService.getAllCountries();
  let rndCountry;

  const card = $(".main__section-card");
  const cardTitle = $("<h2></h2>").addClass(
    "main__section-card-heading fadeTo"
  );
  const cardImg = $("<img>").addClass("main__section-card-img fadeTo");
  const cardText = $("<p></p>").addClass("main__section-card-text fadeTo");
  const imgContainer = $("<div></div>").addClass("shadow").append(cardImg);

  $(".loader-img").attr("style", "display:none");
  card.append(cardTitle, imgContainer, cardText);

  function updateCardData() {
    $(".main__section-card .fadeTo").attr("style", "opacity: 0");

    const rndIndex = getRndInteger({ max: allCountries.length });
    rndCountry = allCountries[rndIndex];

    cardTitle.text(rndCountry?.name?.common);
    cardImg.attr({
      src: rndCountry?.flags?.svg,
      alt: `Flag of ${rndCountry?.name?.common}`,
    });
    cardText.text(createDescription(rndCountry));

    $(".main__section-card .fadeTo").fadeTo(300, 1);
  }

  $("#rand").click(updateCardData);
  updateCardData();

  //* Navigation
  function navigate() {
    const addr = new URL(window.location.origin);
    addr.pathname = "pages/profile.html";
    addr.searchParams.set("country", rndCountry.name.common);

    window.location.assign(addr);
  }

  card.click(navigate);
});
