import {Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { format } from 'openlayers';
import { GetParametersService } from '../../services/get-parameters.service';

import { SearchService, QueryParameter } from '../../services/search.service';
import { MatSnackBar } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'sic-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  myControl = new FormControl('');
  searchStr = '';
  activeSearch = false;
  options = [];
  filteredOptions: Observable<any>;

  @Output('menu') menu = new EventEmitter();

  // constructor(private searchService: SearchService) { }

  constructor(private ss: SearchService,
              private snackBar: MatSnackBar,
              private getParametersService: GetParametersService) { }

  ngOnInit() {
    this.options = this.ss.GetHistorySearch();
    this.filteredOptions = this.myControl.valueChanges
      .startWith(null)
      .map(state => state && typeof state === 'object' ? state.state : state)
      .map(val => val ? this.filter(val) : this.options.slice());

    this.myControl.valueChanges.subscribe(newVal => {
      if (typeof newVal === 'object') {
        this.search(newVal.state);
      }
    });
    this.getParametersService.readCriterioParams();
    this.getParametersService.doQueryEmbebido.subscribe((criterio: any) => {
      setTimeout(() => {
        this.search(criterio);
      }, 1000);
    });
  }

  filter(val: string) {
    return this.options.filter(option => new RegExp(val, 'gi').test(option.state));
  }

  displayFn(state): string {
    return state ? state.state : state;
  }

  search(value) {
    const query: QueryParameter = this.ss.configureQuery(value);
    this.ss.AddVectorLayer();
    this.ss.ClearVectorLayer();
    if (query.found) {
      this.ss.executeQuery(query).subscribe(features => {
        const arrFeat: any [] = features.json() as any [];
        let featureGeoJSON: any;
        arrFeat.map( f => {
          if (f.poligono !== undefined) {
            featureGeoJSON = new format.GeoJSON().readFeature(f.poligono.geojson);
          } else { // Es redvial o alguna linea
            featureGeoJSON = new format.GeoJSON().readFeature(f.geoJSON);
          }

          featureGeoJSON.setProperties(
            Object.entries(f).filter(([k, v]) => ['poligono', 'geoJSON', 'geometry'].indexOf(k) === -1)
                               .reduce((ant, [k, v]) => { ant[k] = v; return ant; }, {})
          , true);
          this.ss.AddFeature(featureGeoJSON);
        });
        if (arrFeat.length > 0) {
          this.ss.SaveHistorySearch(value);
          this.ss.ZoomSelection();
          this.options = this.ss.GetHistorySearch();
          console.log(features);

          this.activeSearch = true;

        } else {
           this.snackBar.open('No se encontraron objetos espaciales', 'X', {
             duration: 5000,
             extraClasses: ['search-snackbar']
           });
        }
      }, error => {
        console.log(error);
      });
    } else {
      alert('no se encontro');
    }
  }

  clearSearch() {
    this.ss.ClearVectorLayer();
    this.myControl.setValue('');
    this.activeSearch = false;
  }


  openMenu() {
    this.menu.emit('open');
  }

}
