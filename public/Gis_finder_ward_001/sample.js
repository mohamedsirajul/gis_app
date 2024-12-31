var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    return false;
};

var overlayPopup = new ol.Overlay({
    element: container
});

var view = new ol.View({
    zoom: 16, // Changed from 7 to 16 for closer initial view
    maxZoom: 20,
    minZoom: 1,
    projection: 'EPSG:3857'
});

var pointZoom = 16;

var map = new ol.Map({
    controls: [
        new ol.control.ScaleLine({
            "minWidth": 64,
            "units": "metric"
        }),
        new ol.control.LayerSwitcher({
            "showZoomTo": false,
            "allowFiltering": true,
            "allowReordering": false,
            "showDownload": false,
            "showOpacity": false,
            "tipLabel": "Layers"
        }),
        new ol.control.Legend(),
        new ol.control.Geolocation(),
        new ol.control.OverviewMap({
            collapsed: true,
            layers: [overviewMapBaseLayer, lyr_ward_boundary, lyr_building_ppt, lyr_carriageway, lyr_road_centerline]
        }),
        new ol.control.MousePosition({
            "projection": "EPSG:4326",
            "undefinedHTML": "&nbsp;",
            "coordinateFormat": ol.coordinate.createStringXY(4)
        }),
        new ol.control.HomeButton(),
        new ol.control.ZoomSlider(),
        new ol.control.Rotate({
            autoHide: false
        }),
        new ol.control.FullScreen(),
        new ol.control.Zoom({
            "zoomInTipLabel": "Zoom in",
            "zoomOutLabel": "-",
            "zoomOutTipLabel": "Zoom out",
            "duration": 250,
            "zoomInLabel": "+",
            "delta": 1.2
        })
    ],
    target: document.getElementById('map'),
    renderer: 'canvas',
    overlays: [overlayPopup],
    layers: layersList,
    view: view
});

var originalExtent = [8560234.043578, 1234399.643779, 8563649.882101, 1236292.160363];
map.getView().fit(originalExtent, {
    size: map.getSize(),
    maxZoom: 8
});

var currentInteraction;

var surveyor_submitted_36_gisId = new Set();

function isGisIdSubmitted(gisId) {
    return surveyor_submitted_36_gisId.has(gisId);
}

window.updateSubmittedGisId = function(gisId) {
    surveyor_submitted_36_gisId.add(gisId);
    lyr_building_ppt.changed();
};

window.addEventListener('load', function() {
    try {
        const storedGisIds = JSON.parse(localStorage.getItem('surveyor_submitted_36_gisId') || '[]');
        storedGisIds.forEach(gisId => {
            surveyor_submitted_36_gisId.add(gisId);
            window.updateBuildingColor(gisId, 'rgba(0,255,0,0.8)');
        });
        lyr_building_ppt.changed();
    } catch (error) {
        console.error('Error loading submitted GIS IDs:', error);
    }
});

popupLayers = [``, `<b>SHAPE_Area</b>: [SHAPE_Area]<br><b>GISID</b>: [GISID]`, ``, ``];

var popupEventTriggered = function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var popupTexts = [];
    var currentFeature;
    var allLayers = getAllNonBaseLayers();

    // Zoom to the clicked location
    if (coord) {
        map.getView().animate({
            center: coord,
            zoom: 16, // Adjust the zoom level as needed
            duration: 1000 // Smooth animation duration in milliseconds
        });
    }

    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        feature = decluster(feature);
        if (feature) {
            // Store GISID in localStorage if it exists
            const gisId = feature.get('GISID');
            if (gisId) {
                localStorage.setItem('selectedGISID', gisId);
                console.log('Stored GISID:', gisId);
            }

            popupDef = popupLayers[allLayers.indexOf(layer)];
            if (popupDef) {
                var featureKeys = feature.getKeys();
                for (var i = 0; i < featureKeys.length; i++) {
                    if (featureKeys[i] != 'geometry') {
                        var value = feature.get(featureKeys[i]);
                        if (value) {
                            popupDef = popupDef.split("[" + featureKeys[i] + "]").join(
                                String(feature.get(featureKeys[i]))
                            )
                        } else {
                            popupDef = popupDef.split("[" + featureKeys[i] + "]").join("NULL")
                        }
                    }
                }
                popupTexts.push(popupDef);
            }
        }
    });

    if (popupTexts.length) {
        overlayPopup.setPosition(coord);
        const selectButton = '<br><button onclick="selectAndClose()" class="btn btn-primary btn-sm">Select Property</button>';
        content.innerHTML = popupTexts.join("<hr>") + selectButton;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        closer.blur();
    }
};

map.on('singleclick', function(evt) {
    popupEventTriggered(evt);
});

window.selectAndClose = function() {
    const gisId = localStorage.getItem('selectedGISID');
    if (gisId) {
        if (window.opener) {
            window.close();
        }
        if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'GISID_SELECTED', gisId: gisId }, '*');
        }
    }
};
