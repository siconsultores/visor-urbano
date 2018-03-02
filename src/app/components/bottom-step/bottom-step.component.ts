import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sic-bottom-step',
  templateUrl: './bottom-step.component.html',
  styleUrls: ['./bottom-step.component.scss']
})
export class BottomStepComponent implements OnInit {

  @Input('steps') steps;
  @Input('currentStep') currentStep;

  @Output('prevStep') prevStep = new EventEmitter();
  @Output('nextStep') nextStep = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  back() {
    this.prevStep.emit(this.currentStep);
  }

  next() {
    this.nextStep.emit(this.currentStep);
  }

}
