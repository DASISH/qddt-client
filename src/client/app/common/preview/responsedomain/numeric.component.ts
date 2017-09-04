import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../../components/responsedomain/responsedomain.service';


@Component({
  selector: 'qddt-preview-rd-numeric',
  moduleId: module.id,
  template: `<div class="row" *ngIf="responseDomain">
        <form>
          <input type="number" min="{{low}}" max="{{high}}" step="{{stepping}}"
            id="numeric-domain-{{responseDomain.id}}"
            name="numeric-domain-{{responseDomain.id}}"
            [ngModel]="value"
            (ngModelChange)="changeNumber($event)">
          <label>Range from {{low}} to {{high}}</label>
        </form>
      </div>`,
  styles: [],
})

export class ResponsedomainNumericComponent implements OnChanges {
  @Input() responseDomain: ResponseDomain;
  low: number;
  high: number;
  stepping:string;
  value: number;

  ngOnChanges() {
    this.low = 0;
    this.high = 1;
    let rep = this.responseDomain.managedRepresentation;
    if (rep !== undefined) {
      if (rep.inputLimit !== undefined
        && rep.inputLimit.maximum !== undefined) {
        this.high = rep.inputLimit.maximum;
      }
      if (rep.inputLimit !== undefined
        && rep.inputLimit.minimum !== undefined) {
        this.low = rep.inputLimit.minimum;
      }
      if (rep.format === undefined) {
        rep.format = '0';
      }
      let step =parseInt(rep.format);
      if (step >0)
        this.stepping ='0.';

      for(let i=1;i< step;i++) {
        this.stepping += '0';
      }
      this.stepping +='1';
    }
  }

  changeNumber(value: number) {
    if(value >= this.low && value <= this.high) {
      this.value = value;
    } else if(value < this.low) {
      this.value = this.low;
    } else if(value > this.high) {
      this.value = this.high;
    }
  }
}
