import { Component, Input, OnChanges } from '@angular/core';
import {Category} from '../../../lib/classes';


@Component({
  selector: 'qddt-preview-rd-numeric',

  template: `
    <div class="row" *ngIf="managedRepresentation">
      <form>
        <input type="number" min="{{low}}" max="{{high}}" step="{{stepping}}"
          id="numeric-domain-{{managedRepresentation.id}}"
          name="numeric-domain-{{managedRepresentation.id}}"
          [ngModel]="value"
          (ngModelChange)="changeNumber($event)">
        <label>Range from {{ low }} to {{ high }} steps {{ stepping }}</label>
      </form>
    </div>`,
  styles: [],
})

export class ResponsedomainNumericComponent implements OnChanges {
  @Input() managedRepresentation: Category;
  low: number;
  high: number;
  stepping: number;
  value: number;

  ngOnChanges() {
    this.low = 0;
    this.high = 1;
    const rep = this.managedRepresentation;
    if (rep) {
      if (rep.inputLimit) {
        this.high = rep.inputLimit.maximum;
        this.low = rep.inputLimit.minimum;
      }
      if (!rep.format) {
        rep.format = '0';
      }
      this.stepping = this.parts(rep.format);
    }
  }

  changeNumber(value: number) {
    if (value >= this.low && value <= this.high) {
      this.value = value;
    } else if (value < this.low) {
      this.value = this.low;
    } else if (value > this.high) {
      this.value = this.high;
    }
  }

  parts(format: number): number {
    return 1 / Math.pow(10, format);
  }

}
