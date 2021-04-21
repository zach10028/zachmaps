window.onload = init;

function init(){
  proj4.defs("EPSG:6623","+proj=aea +lat_1=60 +lat_2=46 +lat_0=44 +lon_0=-68.5 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
  ol.proj.proj4.register(proj4);
  const MontrealCenter = [-73.6, 45.5]
  const map = new ol.Map({
    view: new ol.View({
      center: ol.proj.fromLonLat([-73.57346643032959, 45.502109909201245], 'EPSG:6623'),
      zoom: 4,
      extent: ol.proj.transformExtent([-73.63730, 45.4750, -73.532987, 45.537212], 'EPSG:4326', 'EPSG:6623'),
      projection: 'EPSG:6623',
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'openlayers-map'
  })

  // Montreal POI and Styling
  const POI_styles = function(feature){
    let poi_id = feature.get('id');
    let poi_id_str = poi_id.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [150, 150, 150, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [74, 74, 74, 1],
            width: 2
          }),
          radius: 8
        }),

      })
    ]
    return styles
  }

  const POI_styles_selected = function(feature){
    let poi_id = feature.get('id');
    let poi_id_str = poi_id.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [230, 117, 60, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [88, 88, 88, 1],
            width: 2
          }),
          radius: 8
        }),
        text: new ol.style.Text({
          text: poi_id_str,
          scale: 1,
          fill: new ol.style.Fill({
            color: [255, 255, 255, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [0, 0, 0, 1],
            width:0.3
          })
        })
      })
    ]
    return styles
  }

  const apr21 = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: './data/vector_data/MTL_POI_APR2021.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: POI_styles
})
  map.addLayer(apr21);

    // vector feature popup information
  /*const overlayContainerElement = document.querySelector('.overlay-container');
  const overlayLayer = new ol.Overlay({
      element: overlayContainerElement,
  })
  map.addOverlay(overlayLayer);
  const overlayFeatureName = document.getElementById('name') */



  // map features click logic
  // need the name of POI and the image and the column navigation (html), need access to view. 

  const navElements = document.querySelector('.column-navigation');
  const POI_name_element = document.getElementById('POIname');
  const POI_image_element = document.getElementById('POIimage');
  const POI_image_element2 = document.getElementById('POIimage2');
  const POI_image_element3 = document.getElementById('POIimage3');
  const POI_image_element4 = document.getElementById('POIimage4');

  const POI_desc_element1 = document.getElementById('POIdesc1')
  const POI_desc_element2 = document.getElementById('POIdesc2')
  const POI_desc_element3 = document.getElementById('POIdesc3')
  const POI_desc_element4 = document.getElementById('POIdesc4')

  const POI_year_element1 = document.getElementById('POIyear1')
  const POI_year_element2 = document.getElementById('POIyear2')
  const POI_year_element3 = document.getElementById('POIyear3')
  const POI_year_element4 = document.getElementById('POIyear4')
  const mapView = map.getView();

  map.on('singleclick', function(evt){
    map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
      //console.log(feature);
      let featureID = feature.get('id');
      let navElement = navElements.children.namedItem(featureID);
      mainLogic(feature, navElement)
    })
  })

    /*map.on('pointermove', function(x){
    map.forEachFeatureAtPixel(x.pixel, function(feature, layer){
      //console.log(feature);
      let clickedcoord = x.coordinate;
      let featureType = feature.get('name');
      if (featureType != undefined) {
          overlayLayer.setPosition(clickedcoord);
          overlayFeatureName.innerHTML = featureType;
      }
    })
  }) */ 

  function mainLogic(feature, clickedAnchorElement){
    // reassign active class to the clicked element
    let currentActiveStyledElement = document.querySelector('.active');
    currentActiveStyledElement.className = currentActiveStyledElement.className.replace('active', '');
    clickedAnchorElement.className = 'active';


    // default style for all features
    let POI_Features2 = apr21.getSource().getFeatures();
    POI_Features2.forEach(function(feature){
      feature.setStyle(POI_styles);
    })

    //Home element: change content in the menu to HOME
    if(clickedAnchorElement.id === 'Home'){
      mapView.animate({center: ol.proj.fromLonLat([-73.57346643032959, 45.502109909201245], 'EPSG:6623')}, {zoom: 4}); // this may not work
      POI_name_element.innerHTML = 'Click on a marker and see how the location has changed with time';
      POI_image_element.setAttribute('src', './data/static_image/logo.png');
      POI_image_element2.setAttribute('src', './data/static_image/logo.png');
      POI_image_element3.setAttribute('src', './data/static_image/logo.png');
      POI_image_element4.setAttribute('src', './data/static_image/logo.png');

      POI_desc_element1.innerHTML = 'This map was made based on the book "Montreal Then and Now: Montréal Hier et Aujourdhui" by Bryan Demchinsky';
      POI_desc_element2.innerHTML = '';
      POI_desc_element3.innerHTML = '';
      POI_desc_element4.innerHTML = '';

      POI_year_element1.innerHTML = 'Click the Home button to refresh the map';
      POI_year_element2.innerHTML = '';
      POI_year_element3.innerHTML = '';
      POI_year_element4.innerHTML = '';

      



      //console.log(clickedAnchorElement, clickedAnchorElementID);
    }
    // change view from the selected features
    else {
      feature.setStyle(POI_styles_selected);
      let featureCoordinates = feature.get('geometry').getCoordinates();
      mapView.animate({center: featureCoordinates}, {zoom:17});
      let featureName = feature.get('name');

      let featureImage = feature.get('image1');
      let featureImage2 = feature.get('image2');
      let featureImage3 = feature.get('image3');
      let featureImage4 = feature.get('image4');
      let featureDesc = feature.get('desc1');
      let featureDesc2 = feature.get('desc2');
      let featureDesc3 = feature.get('desc3');
      let featureDesc4 = feature.get('desc4');
      let featureYear = feature.get('year1');
      let featureYear2 = feature.get('year2');
      let featureYear3 = feature.get('year3');
      let featureYear4 = feature.get('year4');

      // temp fix to deal with nulls
      if(featureImage4 === null){
        featureImage4 = featureImage;
        featureDesc4 = featureDesc;
        featureYear4 = featureYear;
      }

      POI_name_element.innerHTML = featureName;

      POI_image_element.setAttribute('src', './data/static_image/' + featureImage + '.png');
      POI_image_element2.setAttribute('src', './data/static_image/' + featureImage2 + '.png');
      POI_image_element3.setAttribute('src', './data/static_image/' + featureImage3 + '.png');
      POI_image_element4.setAttribute('src', './data/static_image/' + featureImage4 + '.png');

      POI_desc_element1.innerHTML = featureDesc;
      POI_desc_element2.innerHTML = featureDesc2;
      POI_desc_element3.innerHTML = featureDesc3;
      POI_desc_element4.innerHTML = featureDesc4;
  
      POI_year_element1.innerHTML = featureYear;
      POI_year_element2.innerHTML = featureYear2;
      POI_year_element3.innerHTML = featureYear3;
      POI_year_element4.innerHTML = featureYear4;
  
    }
  }

  // navigation button logic
  const anchorNavElements = document.querySelectorAll('.column-navigation > a');
  //console.log(anchorNavElements);
  for(let anchorNavElement of anchorNavElements){
    anchorNavElement.addEventListener('click', function(e){
      let clickedAnchorElement = e.currentTarget;
      //console.log(clickedAnchorElement);
      let clickedAnchorElementID = clickedAnchorElement.id.toString();
      //console.log(clickedAnchorElementID);
      let POI_Features2 = apr21.getSource().getFeatures();
      //console.log(POI_Features2);
      POI_Features2.forEach(function(feature){
        let featureName2 = feature.get('id').toString();
        //console.log(featureName2);
        //console.log(featureNameStr);
        if(clickedAnchorElementID === featureName2){
          mainLogic(feature, clickedAnchorElement);
        }
      })
      
      // home nav
      if(clickedAnchorElementID === 'Home'){
        mainLogic(undefined, clickedAnchorElement)
      }
    })
  }

  // feature hover logic
  const popoverTextElement = document.getElementById('popover-text');
  const popoverTextLayer = new ol.Overlay({
    element: popoverTextElement,
    positioning: 'bottom-center',
    stopEvent: false,
  })
  map.addOverlay(popoverTextLayer);

  map.on('pointermove', function(evt){
    let isFeatureAtPixel = map.hasFeatureAtPixel(evt.pixel);
    if(isFeatureAtPixel){
      let featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
      let featureName = featureAtPixel[0].get('name');
      //console.log(featureName);
      popoverTextLayer.setPosition(evt.coordinate);
      popoverTextElement.innerHTML = featureName;

      //change cursur
      // need viewport
      map.getViewport().style.cursor = 'pointer';
      
    } else {
      popoverTextLayer.setPosition(undefined);
      map.getViewport().style.cursor = '';
    }
  })



  

}




