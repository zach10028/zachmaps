window.onload = init;
function init (){
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
    const zoomToExtentControl = new ol.control.ZoomToExtent(); 
//MAP TIME
    const map = new ol.Map({
        view: new ol.View({
            center: [-8199347, 5700422],
            zoom: 5,
            maxZoom: 20, 
            minZoom: 5,
            extent: [-8196614.9, 5696838.12, -8185168.66, 5707121.24]
            //extent: [-8261752.12815925, 5679818.767847327, -8145029.075498538, 5736813.63818657],
            //projection: 'EPSG:3857' 
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
            zoomToExtentControl]),
    })
// Base Layers
    const openstreetmapHumanitarian = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: false,
        title: 'OSMHumanitarian',
    })
    const cartoDBBaseLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{scale}.png',
            attributions: '<a href=https://carto.com/>© CARTO </a>',
        }),
        visible: true,
        title: 'Carto',
    })
    const baselayerGroup = new ol.layer.Group({
        layers: [ openstreetmapHumanitarian, cartoDBBaseLayer
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
    const fillStyle = new ol.style.Fill({
        color: [40, 119, 247, 1]
    })
    const lineStyle = new ol.style.Stroke({
        color: [30, 30, 31, 1],
        width: 1.2,
        //lineCap: 'square',
        //lineJoin: 'bevel',
        //lineDash: [3,3],
    })
    const regularShape = new ol.style.RegularShape({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        stroke: lineStyle,
        points: 10,
        radius: 5,
    })
    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 4.5,
        stroke: lineStyle
    })
    const iconStyle = new ol.style.Icon({
        src: './data/static_image/marker.png',
        //size: [100,100],
        offset: [0,0],
        opacity: 1,
        scale: 0.75,
        color: [44,40,40,0],
    })
    const borderStyle = function(feature){
        let geometryType2 = feature.getGeometry().getType();
        let borderz = feature.get('border')
        //console.log(borderz);
        if(geometryType2 === 'LineString'){
            if(borderz === 'internal'){
                feature.setStyle([provlinestyle])
            }
            if(borderz === 'external'){
                feature.setStyle([lineStyle2])
            }
        }
    }
    const pointStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: [245, 49, 5, 1]
            }),
            radius: 4.5,
            stroke: new ol.style.Stroke({
                color: [245, 49, 5, 1],
                width: 2
            })
        })
    })
    const lineStyle2 = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: [59,59,59,1],
            width: 2
        })
    })
    const provlinestyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: [59,59,59,1],
            width: 1,
            lineDash: [3],
        })
    })
    const canadaStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: [255,165,0,1], //yellow
        })
    })
    const usaStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: [60,179,113,1], //green
        })
    })
    const fraStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: [0,0,255,1] // blue
        })
    })
    const NE_CANUSA_Style = function(feature){
        let geometryType = feature.getGeometry().getType();
        let country = feature.get('Country');
        let borders = feature.get('Name');
        if (geometryType === 'Point'){
            feature.setStyle([pointStyle])
        }
        if (geometryType === 'LineString'){
            if(borders === 'A'){
                feature.setStyle([provlinestyle])
            }
            if(borders === 'B'){
                feature.setStyle([lineStyle2])
            }
        }
        if (geometryType === 'Polygon'){
            if(country === 'Canada'){
                feature.setStyle([canadaStyle])
            };
            if (country === 'United States'){
                feature.setStyle([usaStyle])
            };
            if (country === 'France'){
                feature.setStyle([fraStyle])
            };
        };
    }
    const CANUSAborders = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: './data/vector_data/borders.geojson',
            format: new ol.format.GeoJSON(),
        }),
        visible: false,
        title: 'borders',
        style: borderStyle,
        zIndex: 1,
    })
    const MtlPOI = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/vector_data/POI.geojson',  // POI for real deal, POI_1-10 for test sample
            format: new ol.format.GeoJSON(),
        }),
        visible: false,
        title: 'MTL_POI',
        style: new ol.style.Style({
            image: circleStyle,
        })
    })

    const POI_10 = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/vector_data/test_PostCrash.geojson',
            format: new ol.format.GeoJSON(),

        }),
        visible: true,
        title: 'POI_10',
        style: new ol.style.Style({
            image: circleStyle,
        })
    })


    const NE_CANUSA = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/vector_data/CANUSApoly.geojson',
            format: new ol.format.GeoJSON(),
        }),
        visible: false,
        title: 'North East Canada and USA',
        style: NE_CANUSA_Style,
        zIndex: 0,
    })
    const NE_CANUSApnt = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/vector_data/CANUSApnt.geojson',
            format: new ol.format.GeoJSON(),
        }),
        visible: false,
        title: 'North East Canada and USA2',
        style: NE_CANUSA_Style,
        zIndex: 2,
        
    })
    // Raster Tile Layer Grou
    const rasterLayerGroup = new ol.layer.Group({
        layers:[ POI_10, MtlPOI, NE_CANUSA, CANUSAborders, NE_CANUSApnt, 
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
    // vector feature popup logic



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

            document.getElementById('poi_name').innerHTML = (featureType);
            document.getElementById('poi_image1').innerHTML = (image1);
            document.getElementById('poi_image2').innerHTML = (image2);
        })
    })
    





}

