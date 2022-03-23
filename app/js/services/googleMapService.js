const URL = "https://maps.google.com/maps";

function zoomLevel(area) {
  if (area > 5_000_000) {
    return "3";
  } else if (area > 1_500_000) {
    return "4";
  } else if (area > 300_000) {
    return "5";
  } else if (area > 120_000) {
    return "6";
  } else if (area > 30_000) {
    return "7";
  } else if (area > 1_000) {
    return "8";
  } else {
    return "10";
  }
}

function mapUrl(country) {
  const latitude = country.latlng[0];
  const longitude = country.latlng[1];

  return `${URL}?q=${latitude},${longitude}&t=&z=${zoomLevel(
    country.area
  )}&ie=UTF8&iwloc=&output=embed`;
}

export function loadGoogleMap(country, elementId) {
  const map = document.getElementById(elementId);
  map.setAttribute("src", mapUrl(country));
}
