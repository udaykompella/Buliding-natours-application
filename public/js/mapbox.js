const locations = JSON.parse(document.getElementById("map").dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  "pk.eyJ1IjoidWRheXVuaXF1ZSIsImEiOiJjbHNxZmx6Z3gxMWF6MmlvOXh1dmU4NGVwIn0.TDmw88BIUWyB-ZGZrKKbfg";
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
