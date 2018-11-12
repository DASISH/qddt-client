import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ResponseDomain } from '../../modules/responsedomain/responsedomain.classes';
import { Category } from '../../modules/category/category.classes';

@Component({
  selector: 'qddt-preview-rd-datetime',

  template: `
  <div class="row" *ngIf="managedRepresentation">
    <span>
      <label>{{ low }} - {{ high }}</label>
      <input  type="text" class="datepicker" materialize="pickadate" [materializeParams]=
               "[{format:dFormat,selectYears:80, max: [high, 12,31], min: [low, 1,1] }]">
    </span>
  </div>`,
  styles: [],
})

export class ResponsedomainDatetimeComponent implements OnInit, OnChanges {
  @Input() managedRepresentation: Category;

  public low: number;
  public high: number;
  private dFormat: any;
  private dateOptions: any;

  ngOnInit() {
    this.low = 0;
    this.high = 1;
    this.ngOnChanges(null);
  }

  ngOnChanges(changes: SimpleChanges): void {
      const rep = this.managedRepresentation;
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

  private getDefaultPickaOption(): any {
    return Object.assign({}, {
      selectMonths: true,
      selectYears: 80,
      format: this.dFormat,
      max: [this.high, 12, 31],
      min: [this.low, 1, 1],
      editable: true,
      closeOnSelect: true
    });
  }
}
