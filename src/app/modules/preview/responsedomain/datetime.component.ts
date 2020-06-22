import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Category, UserResponse } from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-rd-datetime',

  template: `
  <li *ngIf="managedRepresentation">
    <span>
      <label>{{ low }} - {{ high }}</label>
      <input  type="text" class="datepicker" () >
    </span>
  </li>
`,
  styles: [],
})

export class ResponsedomainDatetimeComponent implements OnInit, OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
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
