window.onload = init;
function init (){
    // EPSG: 6623 for Quebec
    proj4.defs("EPSG:6623","+proj=aea +lat_1=60 +lat_2=46 +lat_0=44 +lon_0=-68.5 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
    // defined... but now you need to register 
    ol.proj.proj4.register(proj4);


    //console.log(ol.proj.toLonLat([180322.83, -399317.85], 'EPSG:6623'));
    //console.log(ol.proj.fromLonLat([]))

//Controls and Attribution
    const attributionControl = new ol.control.Attribution({
        collapsible: true,
    })
    const fullScreenControl = new ol.control.FullScreen({
        label: 'Full',
        labelActive: 'Min',
    });
    const mousePositionControl = new ol.control.MousePosition();
    const overViewMapControl = new ol.control.OverviewMap({
        collapsed: false,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.BingMaps({
                    key: "Ag-LiyfBBG3zzmCJfvqf_U-RlNMP6Cal7KduD7szfpyMczAtf54sA4L24S5mbQ1q",
                    imagerySet: 'Aerial',
                    visible: true,
                }),
            })
        ]
    });
    const scaleLineControl = new ol.control.ScaleLine();
    const zoomSliderControl = new ol.control.ZoomSlider();
    //const zoomToExtentControl = new ol.control.ZoomToExtent(); 
//MAP TIME
    const map = new ol.Map({
        view: new ol.View({
            center: ol.proj.fromLonLat([-73.6, 45.5], 'EPSG:6623'),
            zoom: 1,
            maxZoom: 20, 
            minZoom: 12,
            extent: ol.proj.transformExtent([-73.97878, 45.41224, -73.47309, 45.70650], 'EPSG:4326', 'EPSG:6623'),
            //projection: 'EPSG:4326',
            projection: 'EPSG:6623',
        }),
        target: "js-map",
        keyboardEventTarget: document,
        controls: ol.control.defaults({attribution: false}).extend([
            attributionControl,
            fullScreenControl,
            mousePositionControl,
            overViewMapControl,
            scaleLineControl,
            zoomSliderControl,
            /*zoomToExtentControl*/]),
    })

    /*map.on('click', function(e){
        const test = e.coordinate;
        console.log(test);
        console.log(ol.proj.toLonLat(test, 'EPSG:6623'));
    })*/


// Base Layers

    const cartoDBBaseLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{scale}.png',
            attributions: '<a href=https://carto.com/>© CARTO </a>',
        }),
        visible: true,
        title: 'Carto',
    })
    const baselayerGroup = new ol.layer.Group({
        layers: [cartoDBBaseLayer
        ]
    })
    map.addLayer(baselayerGroup);
    // layer switcher logic for base layers
    const baselayerElements = document.querySelectorAll('.sidebar > input[type=radio')
    for(let baselayerElement of baselayerElements){
        baselayerElement.addEventListener('change', function(){
            let baselayerElementValue = this.value;
            baselayerGroup.getLayers().forEach(function(element, index, array){
                let baselayername = element.get('title');
                element.setVisible(baselayername === baselayerElementValue);
                //console.log('baselayername: ' + baselayername, 'baselayerElementValue: ' + baselayerElementValue);
            })
        })
    }
// vector feature styling

    const lineStyle = new ol.style.Stroke({
        color: [30, 30, 31, 1],
        width: 1.2,
    })

    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 4.5,
        stroke: lineStyle
    })

    const circleStyle2 = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [244, 208, 63, 1]
        }),
        radius: 4.5,
        stroke: lineStyle
    })


    const POI = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/vector_data/MTL_POI.geojson',
            //url: './data/vector_data/test_PostCrash2.geojson',
            format: new ol.format.GeoJSON(),

        }),
        visible: true,
        title: 'POI',

        style: new ol.style.Style({
            image: circleStyle,
        })
    })
    
    const march21 = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/vector_data/MTL_POI_MAR2021.geojson',
            //url: './data/vector_data/test_PostCrash2.geojson',
            format: new ol.format.GeoJSON(),

        }),
        visible: true,
        title: 'march21',

        style: new ol.style.Style({
            image: circleStyle2,
        })
    })
    


    // Raster Tile Layer Grou
    const rasterLayerGroup = new ol.layer.Group({
        layers:[ POI, march21
        ]
    })
    map.addLayer(rasterLayerGroup);
    // layer switcher logic raster tile layer group
    const tileRasterLayerElements = document.querySelectorAll('.sidebar > input[type=checkbox]');
    for(let tileRasterLayerElement of tileRasterLayerElements){
      tileRasterLayerElement.addEventListener('change', function(){
            let tileRasterLayerElementValue = this.value;
            let tileRasterLayer;
        rasterLayerGroup.getLayers().forEach(function(element, index, array){
          if(tileRasterLayerElementValue === element.get('title')){
            tileRasterLayer = element;
          }
        })
        this.checked ? tileRasterLayer.setVisible(true) : tileRasterLayer.setVisible(false)
      })
    }
    // vector feature popup information
    const overlayContainerElement = document.querySelector('.overlay-container');
    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement,
    })
    map.addOverlay(overlayLayer);
    const overlayFeatureName = document.getElementById('name')
    //console.log(overlayFeatureName);
    //const overlayFeatureCountry = document.getElementById('Province')
    //vector feature popup logic

    /*map.on('dblclick', function(e){
        overlayLayer.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            console.log("This is WORKING :)");

        })
    }) */

    



    map.on('click', function(x){
        overlayLayer.setPosition(undefined);
        map.forEachFeatureAtPixel(x.pixel, function(feature, layer){
            console.log(feature.getKeys());
            let clickedcoord = x.coordinate;
            let featureType = feature.get('name');
            if (featureType != undefined) {
                overlayLayer.setPosition(clickedcoord);
                overlayFeatureName.innerHTML = featureType;
            }
            let image1 = feature.get('image1');
            let image2 = feature.get('image2');
            let image3 = feature.get('image3');
            let image4 = feature.get('image4');
            document.getElementById('poi_name').innerHTML = (featureType);
            document.getElementById('poi_image1').innerHTML = (image1);
            document.getElementById('poi_image2').innerHTML = (image2);
            document.getElementById('poi_image3').innerHTML = (image3);
            document.getElementById('poi_image4').innerHTML = (image4);
            let year1 = feature.get('year1');
            let year2 = feature.get('year2');
            let year3 = feature.get('year3');
            let year4 = feature.get('year4');
            document.getElementById('poi_year1').innerHTML = (year1);
            document.getElementById('poi_year2').innerHTML = (year2);
            document.getElementById('poi_year3').innerHTML = (year3);
            document.getElementById('poi_year4').innerHTML = (year4);
            let desc1 = feature.get('desc1');
            let desc2 = feature.get('desc2');
            let desc3 = feature.get('desc3');
            let desc4 = feature.get('desc4');
            document.getElementById('poi_desc1').innerHTML = (desc1);
            document.getElementById('poi_desc2').innerHTML = (desc2);
            document.getElementById('poi_desc3').innerHTML = (desc3);
            document.getElementById('poi_desc4').innerHTML = (desc4);
            if (image3 == undefined){
                document.getElementById('poi_image3').innerHTML = '';
                document.getElementById('poi_image4').innerHTML = '';
                document.getElementById('poi_year3').innerHTML = '';
                document.getElementById('poi_year4').innerHTML = '';
            }
            if (image4 == undefined){
                document.getElementById('poi_image4').innerHTML = '';
                document.getElementById('poi_year4').innerHTML = '';
            }
            if (desc2 == undefined){
                document.getElementById('poi_desc2').innerHTML = '';
            }
            if (desc3 == undefined){
                document.getElementById('poi_desc3').innerHTML = '';
                document.getElementById('poi_desc4').innerHTML = '';
            }
        })
    })

    // selected points have different styles (select interaction)
   /* const selectInteraction = new ol.interaction.Select({
        condition: ol.events.condition.singleClick, 
        layers: function(layer){
            return layer.get('title') === 'POI_10' // make return [layer.get('title) === layer1, layer.get('title) === layer2]
        },
        style: new ol.style.Style({
            image: new ol.style.Circle({
                fill: new ol.style.Fill({
                    color: [51, 224, 255, 1]
                }),
                radius: 12,
                stroke: new ol.style.Stroke({ 
                    color: [255, 255, 255, 1],
                    //width: 1,
                }),
            })
        })
    })
    map.addInteraction(selectInteraction);  */

    // select interaction2

    const selectInteractionV2 = new ol.interaction.Select();
    map.addInteraction(selectInteractionV2)
    selectInteractionV2.on('select', function(e){
        //console.log(e.selected[0].getGeometry().getType()); //need to make sure selection is not empty
        let selectedFeature = e.selected;
        if (selectedFeature.length > 0 && selectedFeature[0].getGeometry().getType() === 'Point'){
            selectedFeature[0].setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    fill: new ol.style.Fill({
                        color: [51, 224, 255, 1]
                    }),
                    radius: 8,
                    stroke: new ol.style.Stroke({
                        color: [255, 255, 255, 1],
                        //width: 1,
                    }),
                })
            }))
        }
    }) 


}

