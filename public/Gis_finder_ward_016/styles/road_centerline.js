var textStyleCache_road_centerline = {}
var clusterStyleCache_road_centerline = {}
var selectedClusterStyleCache_road_centerline = {}
var style_road_centerline = function(feature, resolution) {

    if (feature.hide === true) {
        return null;
    }


    var value = ""
    var style = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(212,127,212,1.0)",
            lineDash: null,
            width: 0
        })
    })];
    var selectionStyle = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(255, 204, 0, 1)",
            lineDash: null,
            width: 0
        })
    })];
    var labelText = "";
    var key = value + "_" + labelText

    if (!textStyleCache_road_centerline[key]) {
        var text = new ol.style.Text({
            font: '1px Calibri,sans-serif',
            text: labelText,
            fill: new ol.style.Fill({
                color: "rgba(None, None, None, 255)"
            }),
        });
        textStyleCache_road_centerline[key] = new ol.style.Style({
            "text": text
        });
    }
    var allStyles = [textStyleCache_road_centerline[key]];
    var selected = lyr_road_centerline.selectedFeatures;
    if (selected && selected.indexOf(feature) != -1) {
        allStyles.push.apply(allStyles, selectionStyle);
    } else {
        allStyles.push.apply(allStyles, style);
    }
    return allStyles;
};