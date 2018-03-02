import { NgModule } from '@angular/core';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatChipsModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatRippleModule,
  MatTabsModule,
  MatTableModule
} from '@angular/material';

const MATERIAL_MODULES = [
  MatAutocompleteModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatListModule,
  MatCardModule,
  MatButtonModule,
  MatChipsModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatRippleModule,
  MatTabsModule,
  MatTableModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES
})
export class SicMaterialModule { }
