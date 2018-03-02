import { NgModule } from '@angular/core';
import { SicMaterialModule } from './sic-material';

@NgModule({
  imports: [
    SicMaterialModule
  ],
  exports: [
    SicMaterialModule
  ]
})
export class SharedModule { }
