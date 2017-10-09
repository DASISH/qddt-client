import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResponseDomain } from '../../../components/responsedomain/responsedomain.service';

@Component({
  selector: 'qddt-preview-rd-datetime',
  moduleId: module.id,
  template: `<div class="row" *ngIf="responseDomain.managedRepresentation">
               <span>
               <label>{{low}} - {{high}}</label>
               <input  type="text" class="datepicker" materialize="pickadate" [materializeParams]=
                         "[{format:dFormat,selectYears:80, max: [high, 12,31], min: [low, 1,1] }]">
                 <!---->
               </span>
             </div>`,
  styles: [],
})

export class ResponsedomainDatetimeComponent implements OnInit,OnChanges {
  @Input() responseDomain: ResponseDomain;

  private low: number;
  private high: number;
  private dFormat: any;
  private dateOptions: any;

  ngOnInit() {
    this.low = 0;
    this.high = 1;
    this.ngOnChanges(null);
  }

  ngOnChanges(changes: any): void {
    if (changes)
      console.log(changes.toString());
    if (this.responseDomain) {
      let rep = this.responseDomain.managedRepresentation;
      if (rep) {
        if (rep.inputLimit.maximum) {
          this.high = rep.inputLimit.maximum;
        }
        if (rep.inputLimit.minimum) {
          this.low = rep.inputLimit.minimum;
        }
        if (rep.format) {
          this.dFormat = rep.format;
        } else {
          this.dFormat = 'd mmmm, yyyy!';
        }
      }
      this.dateOptions = this.getDefaultPickaOption();
    }
  }

  private getDefaultPickaOption(): any {
    return Object.assign({}, {
      selectMonths: true,
      selectYears: 80,
      format: this.dFormat,
      max: [this.high, 12,31],
      min: [this.low, 1,1],
      editable: true,
      closeOnSelect: true
    });
  }
}
