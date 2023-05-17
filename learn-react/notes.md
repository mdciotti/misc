Notes
-----

- consider missing data (tower is unavailable)
- replicate current interface, with additional pollutants
- edited data must be retro-actively imported/updated to DB
- ultimately support multiple cities
- think about better interpolation/visualization algorithm
- what about mobile?


Schema
------

- use upsert
- aggregate all measurements per tower by epoch
- possible measurements: O3, CO, solar, etc.
- store flag as an enum

_id: siteID_epoch
epoch: timeStamp
site: siteID
measurements: [{type: param, value, flag, units, etc.}]


TODO: Frontend
--------------

- choose frontend framework (React)
- re-implement interpolation algo in webgl (backburner)
- choose mapping framework (Mapbox)
- visualize grid points on map
- dont bother with contour

need 24 hours of data to compute AQI


TODO: Backend
-------------

- write real-time CSV importer (see peggy's work)
- determine data schema (for now just ozone)
- JS interpolation to grid points (see Dan's work)
- 2dsphere geospatial index on collection 'Sites'
- index on epoch

let epoch = ((parsedLines[k].TheTime - 25569) * 86400) + (6 * 3600);


References
----------

1. https://github.com/DataAnalyticsinStudentHands/OldOzoneMap
2. https://airvisual.com/earth
3. http://www.redblobgames.com/x/1722-b-rep-triangle-meshes/
4. https://en.wikipedia.org/wiki/Delaunay_tessellation_field_estimator
5. IDW
6. https://en.wikipedia.org/wiki/Air_quality_index#United_States