import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sic-layer-item',
  templateUrl: './layer-item.component.html',
  styleUrls: ['./layer-item.component.scss']
})
export class LayerItemComponent implements OnInit {

  showDetails = false;
  showSublayers = false;
  @Input() layer;
  // @Output() selected = new EventEmitter();
  @Output() toggled = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.showDetails = false;
  }

  toggleDetails(layer) {
    if (!!layer.layers) {
      this.showSublayers = !this.showSublayers;
    } else {
      this.showDetails = !this.showDetails;
    }
  }

  // selectLayer(layer) {
  //   this.selected.emit(layer);
  // }

  toggle(layer, evt) {
    layer.layer.setVisible(!layer.layer.getVisible());
    // this.toggled.emit({visible: evt.checked, layer: layer.id});
  }

  updateOpacity(layer, value) {
    layer.layer.setOpacity(value);
    // layer.layer.layer.setOpacity(value);
  }

}
