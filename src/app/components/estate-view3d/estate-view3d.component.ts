import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Estate3dService} from '../../services/estate3d.service';

// console.log(window);

const Cesium: any = window['Cesium'];

// import * as Cesium from 'cesium/Source/Cesium';

@Component({
  selector: 'sic-estate-view3d',
  templateUrl: './estate-view3d.component.html',
  styleUrls: ['./estate-view3d.component.scss']
})
export class EstateView3dComponent implements OnInit {

  show3D = false;
  upSearch;

  cesiumViewer: any;
  dataSource: any;

  selectedFeature: any;
  oldStyle: any;

  searchFeatures: any[] = [];
  myControl = new FormControl('');

  constructor(private estate3d: Estate3dService) { }

  ngOnInit() {

    const self = this;

    const terrainProvider = new Cesium.CesiumTerrainProvider({
      url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
      requestVertexNormals : true,
      credit: 'Cesium Terrain Provider'
    });

    const imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
      url : '//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
      credit: 'ArcGIS Online Imagery'
    });

    self.cesiumViewer = new Cesium.Viewer('cesiumContainer', {
      animation: false,
      // terrainProvider: terrainProvider,
      imageryProvider: imageryProvider,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      timeline: false,
      sceneModePicker: false,
      creditContainer: 'credits',
      baseLayerPicker : false
    });


    const handler = new Cesium.ScreenSpaceEventHandler(self.cesiumViewer.scene.canvas);
    handler.setInputAction(function(evtClick) {
      const pickedObject = self.cesiumViewer.scene.pick(evtClick.position);

      if ( !!self.selectedFeature ) {
        self.selectedFeature.polygon.material = self.oldStyle;
        self.selectedFeature = null;
        self.oldStyle = null;
      }

      self.clearSearch();

      if (!!pickedObject) {
        self.oldStyle = pickedObject.id.polygon.material;
        self.selectedFeature = pickedObject.id;
        pickedObject.id.polygon.material = Cesium.Color.RED;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK );


    this.estate3d.newEstate$.subscribe(clave => {
      console.log(`View3D for ${clave}`);
      this.load3dEstate(clave);
    });

    /*
    const clave = 'D65H3010001';
    setTimeout(() => {
      this.load3dEstate(clave);
    }, 5000);

    */
  }

  load3dEstate(clave) {
    const self = this;
    if (!!clave) {
      Cesium.GeoJsonDataSource.load(`assets/${clave}.json`)
        .then(dataSource => {
          self.dataSource = dataSource;

          const p = dataSource.entities.values;
          const minz = p.reduce((a, b) => (b.properties.MINHEIGHT < a ? b.properties.MINHEIGHT : a), 150000);

          for (let i = 0; i < p.length; i++) {
            // p[i].polygon.height = p[i].properties.NPT - minz;
            // p[i].polygon.extrudedHeight = (p[i].properties.NPT - minz) + (p[i].properties.MAXHEIGHT - p[i].properties.MINHEIGHT);
            p[i].polygon.height = p[i].properties.MINHEIGHT - minz;
            p[i].polygon.extrudedHeight = p[i].properties.MAXHEIGHT - minz;
            // console.log('Poly: ', p[i].polygon.height, p[i].polygon.extrudedHeight);
          }

          self.cesiumViewer.dataSources.removeAll();
          self.cesiumViewer.dataSources.add(dataSource);
          self.cesiumViewer.zoomTo(dataSource);

          this.show3D = true;
        }, error => {
          console.log(error);
          window.alert('Vista 3D no disponible');
        });
    }
  }

  search(clave) {
    this.clearSearch();

    console.log(`Buscando ${clave}`);

    console.log(this.dataSource.entities.values[0]);

    const p = this.dataSource.entities.values.filter(x => {
      console.log(`${x.properties.CLAVEGDL} - ${clave}`);
      return clave.localeCompare( x.properties.CLAVEGDL ) === 0;
    });
    console.log(`Buscadas: `, p);
    // Save current styles
    this.searchFeatures = p.map(x => ({feature: x, material: x.polygon.material}));

    p.forEach(x => x.polygon.material = Cesium.Color.BLUE);
  }

  clearSearch() {
    // Reset styles
    this.searchFeatures.forEach(x => {
      x.feature.polygon.material = x.material;
    });
    this.searchFeatures = [];
    this.myControl.setValue('');
  }

  close() {
    console.log('closing');
    this.show3D = false;
  }

}
