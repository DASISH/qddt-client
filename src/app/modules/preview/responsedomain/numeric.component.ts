import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ResponseCardinality, Category, UserResponse } from '../../../lib/classes';
import { hasChanges } from 'src/app/lib/consts';


@Component({
  selector: 'qddt-preview-rd-numeric',

  template: `
<ng-container  *ngIf="managedRepresentation">
  <div class="input-field">
    <input  type="number" [min]="inputLimit?.minimum" [max]="inputLimit?.maximum" [step]="parts(inputLimit?.stepUnit)" class="validate" required
      [id]="identifier"
      name="value"
      [ngModel]="value"
      (ngModelChange)="changeNumber($event)">
    <label [for]="identifier">{{managedRepresentation.label}}</label>
    <span>Range from {{ inputLimit.minimum }} to {{ inputLimit.maximum }} in steps {{ parts(inputLimit?.stepUnit) }}</span>

  </div>
</ng-container>`,
  styles: [],
})

export class ResponsedomainNumericComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;

  public inputLimit: ResponseCardinality
  value: number;

  public identifier;

  constructor() {
    this.identifier = 'NUM-' + ident++;
  }



  public ngOnChanges(changes: SimpleChanges) {
    if (hasChanges(changes.managedRepresentation)) {
      this.inputLimit = this.managedRepresentation.inputLimit;
      // this.inputLimit.stepUnit = this.parts(this.managedRepresentation.format);
    }
  }


  changeNumber(value: number) {
    if (value >= this.inputLimit.minimum && value <= this.inputLimit.maximum) {
      this.value = value;
    } else if (value < this.inputLimit.minimum) {
      this.value = this.inputLimit.minimum;
    } else if (value > this.inputLimit.maximum) {
      this.value = this.inputLimit.maximum;
    }
    this.selectedEvent.emit([{ label: null, value }]);
  }

  public parts(format: number): number {
    return 1 / Math.pow(10, format);
  }

}

let ident = 0;
