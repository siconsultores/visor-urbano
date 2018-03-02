import { Component, OnInit } from '@angular/core';
import { ProcessService } from '../../process.service';

@Component({
  selector: 'sic-estate-business',
  templateUrl: './estate-business.component.html',
  styleUrls: ['./estate-business.component.scss']
})
export class EstateBusinessComponent implements OnInit {

  option: number;

  constructor(private ps: ProcessService) { }

  ngOnInit() {
    this.option = 1;
    this.ps.estateData.surfaceType = 1;
    this.ps.estateData.surfaceBusinessLine = undefined;
  }

  setSurfaceType(option: number) {
    this.ps.estateData.surfaceType = option;
  }

}
