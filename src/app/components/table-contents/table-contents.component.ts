import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import {SidePanelContentComponent} from '../../services/side-panel.interface';
import {LayerService} from '../../services/layer.service';

@Component({
  selector: 'sic-table-contents',
  templateUrl: './table-contents.component.html',
  styleUrls: ['./table-contents.component.scss']
})
export class TableContentsComponent implements OnInit, SidePanelContentComponent {
  layers: any;

  constructor(private mapaService: MapService, private layerService: LayerService) {}

  ngOnInit() {
    this.layers = this.layerService.getLayers();
    this.layerService.layerListChange.subscribe(l => {
      this.layers = l;
    });
  }

  selectLayer(evt) {
    console.log(evt);
  }

  hide(): void {
    console.log('hide');
  }

  show(): void {
    console.log('show');
  }

  // toggleLayerVisibility (evt) {
  //   if (evt.visible) {
  //     this.mapaService.showLayer(evt.layer);
  //   } else {
  //     this.mapaService.hideLayer(evt.layer);
  //   }
  // }

}
