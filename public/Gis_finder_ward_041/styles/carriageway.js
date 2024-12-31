var textStyleCache_carriageway = {}
var clusterStyleCache_carriageway = {}
var selectedClusterStyleCache_carriageway = {}
var style_carriageway = function(feature, resolution) {

    if (feature.hide === true) {
        return null;
    }


    var value = ""
    var style = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(0,0,0,1.0)",
            lineDash: null,
            width: 0
        }),
        fill: new ol.style.Fill({
            color: "rgba(210,210,210,1.0)"
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

    if (!textStyleCache_carriageway[key]) {
        var text = new ol.style.Text({
            font: '16.5px Calibri,sans-serif',
            text: labelText,
            fill: new ol.style.Fill({
                color: "rgba(0, 0, 0, 255)"
            }),
        });
        textStyleCache_carriageway[key] = new ol.style.Style({
            "text": text
        });
    }
    var allStyles = [textStyleCache_carriageway[key]];
    var selected = lyr_carriageway.selectedFeatures;
    if (selected && selected.indexOf(feature) != -1) {
        allStyles.push.apply(allStyles, selectionStyle);
    } else {
        allStyles.push.apply(allStyles, style);
    }
    return allStyles;
};