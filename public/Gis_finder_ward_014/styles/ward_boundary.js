var textStyleCache_ward_boundary = {}
var clusterStyleCache_ward_boundary = {}
var selectedClusterStyleCache_ward_boundary = {}
var style_ward_boundary = function(feature, resolution) {

    if (feature.hide === true) {
        return null;
    }


    var value = ""
    var style = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(128,152,72,1.0)",
            lineDash: null,
            width: 0
        }),
        fill: new ol.style.Fill({
            color: "rgba(186,221,105,1.0)"
        })
    })];
    var selectionStyle = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(255, 204, 0, 1)",
            lineDash: null,
            width: 0
        }),
        fill: new ol.style.Fill({
            color: "rgba(255, 204, 0, 1)"
        })
    })];
    var labelText = "";
    var key = value + "_" + labelText

    if (!textStyleCache_ward_boundary[key]) {
        var text = new ol.style.Text({
            font: '16.5px Calibri,sans-serif',
            text: labelText,
            fill: new ol.style.Fill({
                color: "rgba(0, 0, 0, 255)"
            }),
        });
        textStyleCache_ward_boundary[key] = new ol.style.Style({
            "text": text
        });
    }
    var allStyles = [textStyleCache_ward_boundary[key]];
    var selected = lyr_ward_boundary.selectedFeatures;
    if (selected && selected.indexOf(feature) != -1) {
        allStyles.push.apply(allStyles, selectionStyle);
    } else {
        allStyles.push.apply(allStyles, style);
    }
    return allStyles;
};