function zoomLevel(area) {
  if (area > 5_000_000) {
    return 3;
  } else if (area > 1_500_000) {
    return 4;
  } else if (area > 300_000) {
    return 5;
  } else if (area > 120_000) {
    return 6;
  } else if (area > 30_000) {
    return 7;
  } else if (area > 1_000) {
    return 8;
  } else {
    return 10;
  }
}

export function loadGoogleMap(country, elementId) {
  const latitude = country.latlng[0];
  const longitude = country.latlng[1];

  let mapDiv = $(`#${elementId}`)[0];
  let latlng = new google.maps.LatLng(latitude, longitude);

  let options = {
    center: latlng,
    zoom: zoomLevel(country.area),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };
  let map = new google.maps.Map(mapDiv, options);
  let marker = new google.maps.Marker({
    position: latlng,
    map: map,
    title: country.name.common,
  });
}
