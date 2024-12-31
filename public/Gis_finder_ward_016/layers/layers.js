baseLayers = [new ol.layer.Tile({
    type: 'base',
    title: 'OSM Mapnik',
    source: new ol.source.OSM()
})];
var baseLayersGroup = new ol.layer.Group({
    'type': 'base',
    'title': 'Base maps',
    layers: baseLayers
});
var overviewMapBaseLayer = baseLayersGroup
var lyr_ward_boundary = new ol.layer.Vector({
    opacity: 1.0,
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojson_ward_boundary)
    }),

    style: style_ward_boundary,
    title: "Ward_Boundary",
    filters: [],
    timeInfo: null,
    isSelectable: true
});
var lyr_building_ppt = new ol.layer.Vector({
    opacity: 1.0,
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojson_building_ppt)
    }),

    style: style_building_ppt,
    title: "Building_PPT",
    filters: [],
    timeInfo: null,
    isSelectable: true
});
var lyr_carriageway = new ol.layer.Vector({
    opacity: 1.0,
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojson_carriageway)
    }),

    style: style_carriageway,
    title: "Carriageway",
    filters: [],
    timeInfo: null,
    isSelectable: true
});
var lyr_road_centerline = new ol.layer.Vector({
    opacity: 1.0,
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojson_road_centerline)
    }),

    style: style_road_centerline,
    title: "Road_Centerline",
    filters: [],
    timeInfo: null,
    isSelectable: true
});

lyr_ward_boundary.setVisible(true);
lyr_building_ppt.setVisible(true);
lyr_carriageway.setVisible(true);
lyr_road_centerline.setVisible(true);
var layersList = [lyr_ward_boundary, lyr_building_ppt, lyr_carriageway, lyr_road_centerline];
layersList.unshift(baseLayersGroup);