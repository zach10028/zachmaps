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




    const POI_10 = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/vector_data/test_PostCrash2.geojson',
            format: new ol.format.GeoJSON(),

        }),
        visible: true,
        title: 'POI_10',
        style: new ol.style.Style({
            image: circleStyle,
        })
    })



    // Raster Tile Layer Grou
    const rasterLayerGroup = new ol.layer.Group({
        layers:[ POI_10
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
    





}

