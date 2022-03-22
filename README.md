# Routing-WebMapping
 A Mapbox API based map showing route between two points selected using fields and stored in a GeoJSON. This was an attempt to solve a business problem for an Amazon DSP's self-owned website to show a route based on the start and end points given by customer on a quotation form.

It is a basic map that loads and asks for location, then centers the map based on the location and if user denies location, a hard coded coordinate is provided and map is loaded.

In live environment, the location feature will be disabled and the start and end points will be fetched from user based input from the quotation form which generates the start and end points as GeoJSON files after converting from a geocoded address.

Currently the map's start and end points are hard coded.
