import { Injectable } from '@angular/core';
import { ComponentPortal, PortalHost } from '@angular/cdk/portal';
import { SidePanelContentComponent } from './side-panel.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as cuid from 'cuid';

interface PortalOptions {
  title: string;
  headerSize: 'small'|'large';
}

interface PortalInterface {
  id: string;
  portal: ComponentPortal<SidePanelContentComponent>;
  options: PortalOptions;
}

@Injectable()
export class SidePanelService {

  private _portalHost: PortalHost;
  private _attachedPortal: any;
  public portals$: BehaviorSubject<PortalInterface>;

  constructor() {
    this.portals$ = new BehaviorSubject(null);
  }

  registerPortalHostComponent(component: PortalHost) {
    if (!component) {
      throw Error('PortalHost component no puede ser nulo');
    }

    this._portalHost = component;
  }

  open(component: SidePanelContentComponent, options: any) {
    if (!this._portalHost) {
      throw Error('PortalHost no registrado');
    }

    if (this._portalHost.hasAttached()) {
      this._attachedPortal.instance.hide();
      this._portalHost.detach();
    }

    const portal = {
      id: (!!options.id ? options.id : '' + options.label + '.' + cuid()),
      portal: new ComponentPortal<SidePanelContentComponent>(component as any),
      options: options
    };

    this.portals$.next(portal);

    this._attachedPortal = this._portalHost.attach(portal.portal);
    this._attachedPortal.instance.show();

  }

  reopen(component: SidePanelContentComponent, options: any) {
    if (!this._portalHost) {
      throw Error('PortalHost no registrado');
    }

    if (this._portalHost.hasAttached() ) {
      this._attachedPortal.instance.show();
    }
  }

  close() {
    if (!this._portalHost) {
      throw Error('PortalHost no registrado');
    }

    if (this._portalHost.hasAttached()) {
      this._attachedPortal.instance.hide();
      this._portalHost.detach();
    }

    this._attachedPortal = null;

    this.portals$.next(null);
  }


}
