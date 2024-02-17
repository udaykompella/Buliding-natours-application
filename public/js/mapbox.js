const locations = JSON.parse(document.getElementById("map").dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  "pk.eyJ1IjoidWRheXVuaXF1ZSIsImEiOiJjbHNxZmx6Z3gxMWF6MmlvOXh1dmU4NGVwIn0.TDmw88BIUWyB-ZGZrKKbfg";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/udayunique/clsqg298v004c01qtcihcfngn", // style URL
  scrollZoom: false,
  //   center: [-118.113491, 34.111745], // starting position [lng, lat]
  //   zoom: 10, // starting zoom
  //   interactive: false,
});

const bound = new mapboxgl.LngLatBounds();
//create marker
locations.forEach((loc) => {
  const el = document.createElement("div");
  el.className = "marker";
  //Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates)
    .addTo(map);
  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
    .addTo(map);
  //Extend map bounds to include current location
  bound.extend(loc.coordinates);
});

map.fitBounds(bound, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});