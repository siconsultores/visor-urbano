import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sic-layer-container',
  templateUrl: './layer-container.component.html',
  styleUrls: ['./layer-container.component.scss']
})
export class LayerContainerComponent implements OnInit {

  @Input('layer') layer: any;

  constructor() { }

  ngOnInit() {
  }

}
