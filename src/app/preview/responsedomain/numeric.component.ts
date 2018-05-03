import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../responsedomain/responsedomain.classes';
import { Category } from '../../category/category.classes';


@Component({
  selector: 'qddt-preview-rd-numeric',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="responseDomain">
      <form>
        <input type="number" min="{{low}}" max="{{high}}" step="{{stepping}}"
          id="numeric-domain-{{responseDomain.id}}"
          name="numeric-domain-{{responseDomain.id}}"
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
      if (rep.inputLimit.maximum) {
        this.high = rep.inputLimit.maximum;
      }
      if (rep.inputLimit.minimum) {
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
