//
// Scripts (fetch start and end from a GeoJSON in live environment, for now it is hard coded except start when location permission given)
// 

mapboxgl.accessToken = 'pk.eyJ1IjoieW5hbmRhbDk5IiwiYSI6ImNsMHNjaHZ5eDAxaDIzYm1wNW5paXFpNXgifQ.KZrGLzhg8pzox-t8T07WVg';

navigator.geolocation.getCurrentPosition(successLocation,
errorLocation, {
	enableHighAcccuracy: true
})

function successLocation(position){
	setupMap([position.coords.longitude,position.coords.latitude]);
	start = [position.coords.longitude,position.coords.latitude];
	
}	

function errorLocation(){
	setupMap([-63.55,44.67]);
	start = [-63.55,44.67];	
}

//style options =  streets-v11, satellite-v9 , dark-v10, light-v10

function setupMap(center){

	map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: center,
	zoom:13
	});
}

end = [-63.6900,44.7234];

// create a function to make a directions request
async function getRoute(end) {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
    { method: 'GET' }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  };
  // if the route already exists on the map, we'll reset it using setData
  if (map.getSource('route')) {
    map.getSource('route').setData(geojson);
  }
  // otherwise, we'll make a new request
  else {
    map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: geojson
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3F07C6',
        'line-width': 6,
        'line-opacity': 0.75
      }
    });
  }

  elNE = document.createElement('div');
  elNE.className = 'markerNE';
  elCS = document.createElement('div');
  elCS.className = 'markerCS';    
  // make a marker for each point and add to the map
  new mapboxgl.Marker(elNE).setLngLat(start).setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h3>Pick Up by NovaXpress</h3><p>${start}</p>`)).addTo(map);
  new mapboxgl.Marker(elCS).setLngLat(end).setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h3>Delivered to Customer</h3><p>${end}</p>`)).addTo(map);  
  // set the map focus to a binding box surrounding start and end points
  const boundingBox = new mapboxgl.LngLatBounds(start, end);
  map.fitBounds(boundingBox,{padding: 160});
  // add turn instructions here at the end - wont be adding by the way
}

/*
map.on('load',() => {
  // make an initial directions request that
  // starts and ends at the same location
  getRoute(end);
});  
*/
 
setTimeout(()=>{
	getRoute(end);
},3000);

function resizebtn(){
	document.getElementById('map').style.width = '50vw';
	document.getElementById('map').style.height = '50vh';
	document.getElementById('resize-btn').remove();
}

document.getElementById('resize-btn').onclick = resizebtn;