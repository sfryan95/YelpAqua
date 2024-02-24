// Set Mapbox access token
mapboxgl.accessToken = mapToken;

// Initialize the map
const map = new mapboxgl.Map({
  container: 'cluster-map', // Specify the container ID
  style: 'mapbox://styles/mapbox/light-v10', // Specify the map style
  center: [-103.59179687498357, 40.66995747013945], // Set initial map center
  zoom: 3, // Set initial zoom level
});

// Add zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl());

// Load and display aquarium data on the map
map.on('load', function () {
  // Add a GeoJSON source for aquariums and enable clustering
  map.addSource('aquariums', {
    type: 'geojson',
    data: aquariums, // Use the 'aquariums' data variable
    cluster: true,
    clusterMaxZoom: 14, // Maximum zoom level for clustering
    clusterRadius: 50, // Cluster radius in pixels
  });

  // Add a layer to render the clusters
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'aquariums',
    filter: ['has', 'point_count'],
    paint: {
      // Define circle colors and sizes based on cluster point count
      'circle-color': ['step', ['get', 'point_count'], '#00BCD4', 10, '#2196F3', 30, '#3F51B5'],
      'circle-radius': ['step', ['get', 'point_count'], 15, 10, 20, 30, 25],
    },
  });

  // Add a layer for the cluster counts
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'aquariums',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
  });

  // Add a layer for individual (unclustered) aquarium points
  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'aquariums',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff',
    },
  });

  // Zoom to an aquarium cluster on click
  map.on('click', 'clusters', function (e) {
    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    const clusterId = features[0].properties.cluster_id;
    map.getSource('aquariums').getClusterExpansionZoom(clusterId, function (err, zoom) {
      if (err) return;
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom,
      });
    });
  });

  // Open a popup with information about the aquarium when clicking on an unclustered point
  map.on('click', 'unclustered-point', function (e) {
    const { popUpMarkup } = e.features[0].properties;
    const coordinates = e.features[0].geometry.coordinates.slice();
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    new mapboxgl.Popup().setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
  });

  // Change the cursor to a pointer when hovering over a cluster
  map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  // Revert cursor when not hovering over a cluster
  map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
  });
});
