import { Component, Input, OnInit } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';

@Component({
  selector: 'responsedomain-numeric',
  moduleId: module.id,
  template: `<div class="row">
        <form>
          <input type="number" min="{{low}}" max="{{high}}"
            id="numeric-domain-{{responseDomain.id}}"
            name="numeric-domain-{{responseDomain.id}}"
            [ngModel]="value"
            (ngModelChange)="changeNumber($event)">
          <label>Range from {{low}} to {{high}}</label>
        </form>
      </div>`,
  styles: [],
})

export class ResponsedomainNumericComponent implements OnInit {
  @Input() responseDomain: ResponseDomain;
  low: number;
  high: number;
  value: number;

  ngOnInit() {
    this.low = 0;
    this.high = 1;
    let rep = this.responseDomain.managedRepresentation;
    if (rep !== undefined) {
      if (rep.inputLimit !== undefined
        && rep.inputLimit.maximum !== undefined) {
        this.high = parseInt(rep.inputLimit.maximum);
      }
      if (rep.inputLimit !== undefined
        && rep.inputLimit.minimum !== undefined) {
        this.low = parseInt(rep.inputLimit.minimum);
      }
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
