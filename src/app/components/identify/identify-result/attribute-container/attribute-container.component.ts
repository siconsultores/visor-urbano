import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'sic-attribute-container',
  templateUrl: './attribute-container.component.html',
  styleUrls: ['./attribute-container.component.scss']
})
export class AttributeContainerComponent implements OnInit {

  @Input('key') key: string;
  @Input('value') value: string;

  constructor() { }

  ngOnInit() {
  }

}
