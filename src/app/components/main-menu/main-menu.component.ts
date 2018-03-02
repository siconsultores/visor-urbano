import {Component, Input, OnInit} from '@angular/core';
import { SidePanelContentComponent } from '../../services/side-panel.interface';
import { SidePanelService } from '../../services/side-panel.service';
import { LoginComponent } from '../login/login.component';
import {TableContentsComponent} from '../table-contents/table-contents.component';
import {SimuladorComponent} from '../simulador/simulador.component';
import { MeasureComponent } from '../measure/measure.component';
import {IdentifyService} from '../identify/identify.service';
@Component({
  selector: 'sic-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit, SidePanelContentComponent {

  @Input('menuItems') menuItems = [];

  largeScreen: boolean;

  constructor( private ss: SidePanelService, private identifyService: IdentifyService) { }

  ngOnInit() {
    this.largeScreen = window.innerWidth >= 800;
  }

  hide() {
    console.log('Main menu is hidding');
  }

  show() {
    console.log('Main menu is showing');
  }

  openMedicion() {
    this.ss.open(MeasureComponent as any, {title: 'Medición', headerSize: 'small'});
  }

  openToC() {
    this.ss.open(TableContentsComponent as any, {title: 'Capas', headerSize: 'small'});
  }

  openSimulador() {
    this.ss.open(SimuladorComponent as any, {title: 'Simulador', headerSize: 'small'});
  }

  toggleIdentifica(evt) {
    console.log('Menu Identifica: ', evt);
    if (evt.checked) {
      this.identifyService.startIdentify();
    } else {
      this.identifyService.stopIdentify();
    }
  }
}
