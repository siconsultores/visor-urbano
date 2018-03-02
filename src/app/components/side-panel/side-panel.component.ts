import { ApplicationRef, Component, ComponentFactoryResolver, Injector, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { DomPortalHost } from '@angular/cdk/portal';
import {SidePanelService} from '../../services/side-panel.service';

@Component({
  selector: 'sic-side-panel',
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.scss'],
  animations: [
    trigger('toggleSidePanel', [
      state('open', style({ width: '360px', 'max-width': '100%', display: 'flex' })),
      state('close', style({ width: '0px', display: 'none' })),
      // transition('open <=> close', animate('100ms ease-in')),
      transition('open => close',
        animate('150ms ease-in', style({width: '0px'}))
      ),
      transition('close => open',
        animate('150ms ease-in', style({width: '360px', 'max-width': '100%'}))
      ),
    ]),
  ]
})
export class SidePanelComponent implements OnInit {

  state = 'open';
  header = 'small';
  title = 'Side Panel';

  // Portal
  @ViewChild('portalHostDiv') portalHostDiv;
  private bodyPortalHost;

  constructor(private panelService: SidePanelService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector ) { }

  ngOnInit() {
    this.bodyPortalHost = new DomPortalHost(
      this.portalHostDiv.nativeElement,
      this.componentFactoryResolver,
      this.appRef,
      this.injector);

    this.panelService.registerPortalHostComponent(this.bodyPortalHost);

    this.panelService.portals$.subscribe(portal => {
      if (!!portal) {
        this.header = portal.options.headerSize;
        this.title = portal.options.title;
        this.state = 'open';
      } else {
        this.title = '';
        this.header = 'large';
        this.state = 'close';
      }
    });
  }

  closePanel() {
    this.panelService.close();
  }
}
