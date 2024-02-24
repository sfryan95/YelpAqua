// Set the access token for Mapbox
mapboxgl.accessToken = mapToken;

// Initialize a new Mapbox map
const map = new mapboxgl.Map({
  container: 'map', // ID of the map container element
  style: 'mapbox://styles/mapbox/light-v10', // Map style URL
  center: aquarium.geometry.coordinates, // Initial map center [longitude, latitude]
  zoom: 10, // Initial zoom level
});

// Add navigation controls to the map (zoom in/out)
map.addControl(new mapboxgl.NavigationControl());

// Create a new marker and add it to the map
new mapboxgl.Marker()
  .setLngLat(aquarium.geometry.coordinates) // Set the marker position
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // Create a popup for the marker
      .setHTML(`<h3>${aquarium.title}</h3><p>${aquarium.location}</p>`)
  ) // Set the content of the popup
  .addTo(map); // Add the marker (with popup) to the map
