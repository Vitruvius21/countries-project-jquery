const URL = "https://restcountries.com/v3.1";

function getData({ countryName, nonUnMembers, all } = {}) {
  return new Promise(function (resolve, reject) {
    function resolver(data, status) {
      if (status === "success") {
        if (countryName) {
          resolve(
            data.filter((country) => {
              return country?.unMember;
            })[0]
          );
        } else if (nonUnMembers) {
          resolve(
            data.filter((country) => {
              return !country?.unMember;
            })
          );
        } else if (all) {
          resolve(data);
        } else {
          resolve(
            data.filter((country) => {
              return country?.unMember;
            })
          );
        }
      } else {
        reject({
          status,
        });
      }
    }

    $.get(
      countryName ? `${URL}/name/${countryName}?fullText=true` : `${URL}/all`,
      resolver
    );
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
