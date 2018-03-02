import { Component } from '@angular/core';
import { SidePanelService } from './services/side-panel.service';
import { MainMenuComponent } from './components/main-menu/main-menu.component';

import { LayerService } from './services/layer.service';

@Component({
  selector: 'sic-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private panelService: SidePanelService, private layerService: LayerService) {
    this.layerService.loadLayers().subscribe(x => {
      console.log('Subs layers', x);

    });
  }

  openMenu() {
    this.panelService.open(MainMenuComponent as any, { title: 'Menu', headerSize: 'large' });
  }

}
