import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sic-service-container',
  templateUrl: './service-container.component.html',
  styleUrls: ['./service-container.component.scss']
})
export class ServiceContainerComponent implements OnInit {

  @Input('service') service: any;

  constructor() { }

  ngOnInit() {
  }

}
