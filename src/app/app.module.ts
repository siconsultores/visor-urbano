import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { MapService } from './services/map.service';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchService } from './services/search.service';
import { GetParametersService } from './services/get-parameters.service';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { SidePanelService } from './services/side-panel.service';

import { LayerService} from './services/layer.service';
import { EstateSelectorComponent } from './components/estate-selector/estate-selector.component';
import { EstateService } from './services/estate.service';
import { RippledButtonComponent } from './components/rippled-button/rippled-button.component';
import { LogoComponent } from './components/logo/logo.component';
import { EstateDetailComponent } from './components/estate-detail/estate-detail.component';
import { MeasureComponent } from './components/measure/measure.component';
import { ReproyeccionService } from './services/reproyeccion.service';
import { BusinessComponent } from './components/process/business/business.component';
import { BuildingComponent } from './components/process/building/building.component';
import { ProcessService } from './components/process/process.service';

import { EstateBusinessComponent } from './components/process/stage/estate-business/estate-business.component';
import { EstateDetailsComponent } from './components/process/stage/estate-details/estate-details.component';
import { EstateDrawingComponent } from './components/process/stage/estate-drawing/estate-drawing.component';
import { EstateFinishComponent } from './components/process/stage/estate-finish/estate-finish.component';
import { BusinessLineComponent } from './components/process/stage/business-line/business-line.component';
import { EstateBuildingComponent } from './components/process/stage/estate-building/estate-building.component';
import { TableContentsComponent } from './components/table-contents/table-contents.component';
import { LayerItemComponent } from './components/table-contents/layer-item/layer-item.component';
import { SimuladorComponent } from './components/simulador/simulador.component';
import { BottomStepComponent } from './components/bottom-step/bottom-step.component';
import { RepeatPipe } from './pipes/repeat.pipe';
import { EstateView3dComponent } from './components/estate-view3d/estate-view3d.component';
import { Estate3dService } from './services/estate3d.service';
import { InfoLicenciasComponent } from './components/info-licencias/info-licencias.component';
import { InfoConstruccionComponent } from './components/info-construccion/info-construccion.component';
import {BuildingLineComponent} from './components/process/stage/building-line/building-line.component';
import { IdentifyComponent } from './components/identify/identify.component';
import { IdentifyResultComponent } from './components/identify/identify-result/identify-result.component';
import { ServiceContainerComponent } from './components/identify/identify-result/service-container/service-container.component';
import { LayerContainerComponent } from './components/identify/identify-result/layer-container/layer-container.component';
import { AttributeContainerComponent } from './components/identify/identify-result/attribute-container/attribute-container.component';
import {IdentifyService} from './components/identify/identify.service';
import { EstateViewfloorComponent } from './components/estate-viewfloor/estate-viewfloor.component';

@NgModule({
  declarations: [
    AppComponent,
    MapViewerComponent,
    SearchBarComponent,
    SidePanelComponent,
    MainMenuComponent,
    BusinessComponent,
    BuildingComponent,
    EstateBusinessComponent,
    EstateBuildingComponent,
    EstateDetailsComponent,
    EstateDrawingComponent,
    EstateFinishComponent,
    BusinessLineComponent,
    BuildingLineComponent,
    EstateSelectorComponent,
    RippledButtonComponent,
    LogoComponent,
    EstateDetailComponent,
    TableContentsComponent,
    LayerItemComponent,
    SimuladorComponent,
    BottomStepComponent,
    RepeatPipe,
    EstateView3dComponent,
    InfoLicenciasComponent,
    InfoConstruccionComponent,
    MeasureComponent,
    IdentifyComponent,
    IdentifyResultComponent,
    ServiceContainerComponent,
    LayerContainerComponent,
    AttributeContainerComponent,
    EstateViewfloorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule,
    SharedModule,
    RouterModule.forRoot([], {
      enableTracing: false
    })
  ],
  entryComponents: [
    MainMenuComponent,
    EstateDetailComponent,
    BusinessComponent,
    BuildingComponent,
    MeasureComponent,
    TableContentsComponent,
    SimuladorComponent
  ],
  providers: [MapService, SearchService, SidePanelService,
    LayerService, EstateService, ProcessService,
    GetParametersService, Estate3dService, ReproyeccionService,
    IdentifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
