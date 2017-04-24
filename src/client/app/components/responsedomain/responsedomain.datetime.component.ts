import { Component, Input, OnInit } from '@angular/core';
import { ResponseDomain } from './responsedomain.service';

@Component({
  selector: 'qddt-responsedomain-datetime',
  moduleId: module.id,
  template: `<div class="row" *ngIf="responseDomain">
               <span>
               <label>{{low}}
               <input  type="date" class="datepicker"/></label>
               </span>
             </div>`,
  styles: [],
})

export class ResponsedomainDatetimeComponent implements OnInit {
  @Input() responseDomain: ResponseDomain;

  low: number;
  private high: number;

  ngOnInit() {
    this.low = 0;
    this.high = 1;
    if (this.responseDomain !== null && this.responseDomain !== undefined) {
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
  }
}
