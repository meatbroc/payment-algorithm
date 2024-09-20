let x = {
  set: function (c) {
    if (typeof c == 'string') {
      let d = c.toUpperCase();
      if (d === 'RJTT') return [35.5523, 139.7798]; // Tokyo Haneda Airport
      if (d === 'KSFO') return [37.7749, -122.4194]; // San Francisco International Airport
      return [0, 0]; // Default coordinates
    }
  }
};

x.fetchAirports = async function getData() {
  const url = "https://www.geo-fs.com/data/airports.js";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    x.text = await response.text();
    eval(x.text); // Be cautious with eval
  } catch (error) {
    console.error(JSON.stringify(error.message));
  }
};

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function haversineDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in kilometers

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

  const distance = R * c; // Distance in kilometers
  return distance;
}

async function main() {
  await x.fetchAirports();

  const coord1 = { lat: x.set('RJTT')[0], lon: x.set('RJTT')[1] };
  const coord2 = { lat: x.set('KSFO')[0], lon: x.set('KSFO')[1] };

  const distance = haversineDistance(coord1, coord2);
  console.log(`Distance: ${distance} km`);
}

main();
