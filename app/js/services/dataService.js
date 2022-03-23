const URL = "https://restcountries.com/v3.1";

function getData({ countryName, nonUnMembers, all } = {}) {
  return new Promise(function (resolve, reject) {
    const xhttp = new XMLHttpRequest();

    if (countryName) {
      xhttp.open("GET", `${URL}/name/${countryName}?fullText=true`);
    } else {
      xhttp.open("GET", `${URL}/all`);
    }

    xhttp.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        if (countryName) {
          resolve(
            JSON.parse(xhttp.response).filter((country) => {
              return country?.unMember;
            })[0]
          );
        } else if (nonUnMembers) {
          resolve(
            JSON.parse(xhttp.response).filter((country) => {
              return !country?.unMember;
            })
          );
        } else if (all) {
          resolve(JSON.parse(xhttp.response));
        } else {
          resolve(
            JSON.parse(xhttp.response).filter((country) => {
              return country?.unMember;
            })
          );
        }
      } else {
        reject({
          status: this.status,
          statusText: xhttp.statusText,
        });
      }
    };

    xhttp.onerror = function () {
      reject({
        status: this.status,
        statusText: xhttp.statusText,
      });
    };

    xhttp.send();
  });
}

export function getCountry(countryName) {
  return getData({ countryName });
}

export function getAllCountries() {
  return getData();
}

export function getAllNonUnTerritories() {
  return getData({ nonUnMembers: true });
}

export function getAllCountriesAndTerritories() {
  return getData({ all: true });
}
