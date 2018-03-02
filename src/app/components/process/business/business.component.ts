import { Component, OnInit } from '@angular/core';
import { SidePanelContentComponent } from '../../../services/side-panel.interface';
import { ProcessService } from '../process.service';
import { EstateService } from '../../../services/estate.service';

@Component({
  selector: 'sic-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit, SidePanelContentComponent {

  steps = [];
  currentStep = 0;
  processStage: any = ProcessStage;

  constructor(
    private ps: ProcessService,
    private es: EstateService
  ) { }

  ngOnInit() {
    this.steps = [
      ProcessStage.Choose,
      ProcessStage.Details,
      ProcessStage.Drawing,
      ProcessStage.Line,
      ProcessStage.Finish
    ];

    this.ps.setData(this.es.getActiveEstate());
    this.ps.setTramite('giro');
  }

  show(): void { }

  hide(): void { }

  nextStep() {
    this.currentStep++;
    if (this.currentStep > this.steps.length - 1) {
      this.currentStep = this.steps.length - 1;
    }
  }

  previousStep() {
    this.currentStep--;
    if (this.currentStep < 0) {
      this.currentStep = 0;
    }
  }

}

enum ProcessStage {
  Choose = 1,
  Details = 2,
  Drawing = 3,
  Line = 4,
  Finish = 5
}
