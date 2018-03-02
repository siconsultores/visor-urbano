import {Component, Input, OnInit} from '@angular/core';

interface ToolbarButtonItem {
  label: string;
  icon: string;
  tooltip: string;
  action(): void;
}

@Component({
  selector: 'sic-rippled-button',
  templateUrl: './rippled-button.component.html',
  styleUrls: ['./rippled-button.component.scss']
})
export class RippledButtonComponent implements OnInit {

  @Input('tool') tool: ToolbarButtonItem;
  @Input('disabled') disabled;

  centered = false;
  disabledR = false;
  unbounded = false;
  rounded = false;
  radius: number = null;
  rippleSpeed = 1;
  rippleColor = 'rgba(61, 77, 81, .15)';

  constructor() { }

  ngOnInit() {
  }

  execAction() {
    if (!this.disabled) {
      this.tool.action();
    }
  }

}
