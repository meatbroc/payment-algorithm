let x = {
  set: function (c) {
    if (typeof c == 'string') {
      let d = c.toUpperCase();
      return d;
    }
  }
};

let airport1 = 'KSFO'
let airport2 = 'RJTT'

let fetchAirports = async function getData() {
  const url = "https://www.geo-fs.com/data/airports.js";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const internalText = await response.text();
    return eval(internalText); // Be cautious with eval
  } catch (error) {
    console.error(JSON.stringify(error.message));
  }
};

async function main() {
  x.text = await fetchAirports();

  const coord1 = { lat: x.text[airport1][0], lon: x.text[airport1][1] };
  const coord2 = { lat: x.text[airport2][0], lon: x.text[airport2][1] };

  const distance = haversineDistance(coord1, coord2);
  console.log(`Distance: ${distance} miles`);
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function haversineDistance(coord1, coord2) {
    const R = 6371;

    const lat1 = toRadians(coord1.lat);
    const lon1 = toRadians(coord1.lon);
    const lat2 = toRadians(coord2.lat);
    const lon2 = toRadians(coord2.lon);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    const miles = distance * 0.621371
    return miles;
}

main();
