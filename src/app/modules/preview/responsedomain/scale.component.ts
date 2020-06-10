import { Component, Input, OnChanges, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Category, UserResponse } from '../../../lib/classes';

class ScaleHead {
  colspan: number;
  class: string;
  label: string;
  width: number;
}

@Component({
  selector: 'qddt-preview-rd-scale',

  templateUrl: './scale.component.html',
  styles: [
    'table { table-layout: fixed; }',
    'table .text-center {text-align: center;}',
    'table .text-left {text-align: left;}',
    'table .text-right {text-align: right;}',
    '[type="radio"] + label { padding-left: 25px; }',
  ],
})


export class ResponsedomainScaleComponent implements OnChanges, AfterViewInit {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() displayLayout = 0;
  @Input() numOfRows = 1;
  public headers: ScaleHead[];
  public columns: UserResponse[];
  public rows: any;
  public max = 5;
  public min = 1;
  public stepUnit = 1;

  private byStep = (max, min, step) => Math.floor(((max - min) / step));

  public ngOnChanges() {
    if (this.managedRepresentation) {
      const rep = this.managedRepresentation;
      this.columns = [];
      this.headers = [];
      this.rows = new Array(this.numOfRows).fill(1);

      if (rep.inputLimit) {
        this.max = rep.inputLimit.maximum;
        this.min = rep.inputLimit.minimum;
        this.stepUnit = rep.inputLimit.stepUnit;
      }

      if (this.byStep(this.max, this.min, this.stepUnit) > 15) {
        const elems = document.querySelectorAll('input[type=range]');
        M.Range.init(elems);
      }

      if (this.displayLayout > 0) {
        this.buildVerticalColumns();
      } else {
        this.buildHorizontalColumns();
      }
    }
  }

  public ngAfterViewInit(): void {
    const elems = document.querySelectorAll('input[type=range]');
    M.Range.init(elems);
  }

  public checkOption(option: any | UserResponse) {
    if (option instanceof UserResponse) {
      this.selectedEvent.emit([{ label: option.label, value: option.value }]);
    } else {
      this.selectedEvent.emit([{ label: '', value: option }]);
    }
  }

  private buildHorizontalColumns() {
    this.columns = [];
    this.headers = [];

    let usedCols = 0;
    const rep = this.managedRepresentation;

    if (!rep) { return; }


    const getAlignment = (category: Category, islast: boolean) => (!category.code.alignment) ?
      (islast) ? 'text-right' : 'text-left' :
      category.code.alignment;


    const minDistance = (c: Category[], stepUnit: number): number => {
      if (!c || c.length < 2) { return 0; }
      let minDiff = this.byStep(c[1].code.getValue(), c[0].code.getValue(), stepUnit);
      for (let i = 2; i < c.length; i++) {
        minDiff = Math.min(minDiff, this.byStep(c[i].code.getValue(), c[i - 1].code.getValue(), stepUnit));
      }
      return (rep.inputLimit.maximum < 4) ? 1 : minDiff;
    }

    const numberOfcols = this.byStep(this.max, this.min, this.stepUnit);

    const categories = rep.children.map(x => Object.assign({}, x))
      .sort((a, b) => a.code.getValue() - b.code.getValue());

    const colspan = minDistance(categories, this.stepUnit);

    console.log('colspan: ' + colspan + ' numberOfcols: ' + numberOfcols);

    for (let i = 0; i < categories.length; i++) {
      let nextcol = this.byStep(categories[i].code.getValue(), this.min, this.stepUnit);

      if (usedCols + 1 <= nextcol) {
        if (nextcol + usedCols + colspan > numberOfcols) {
          nextcol = numberOfcols - colspan;
        }
        if ((nextcol - usedCols > 0)) {
          this.headers.push({
            label: '',
            colspan: (nextcol - usedCols),
            class: 'text-left',
            width: (nextcol - usedCols) / numberOfcols * 100
          });
          usedCols += (nextcol - usedCols);
        }
      }
      const alignment = getAlignment(categories[i], (i + 1 === categories.length));

      this.headers.push({
        label: categories[i].label,
        colspan,
        class: alignment,
        width: colspan / numberOfcols * 100
      });
      usedCols += colspan;
    }
    for (let i = this.min; i <= this.max; i += this.stepUnit) {
      const c = categories
        .find(category => category.code && category.code.getValue() === i);
      this.columns.push({ label: c !== undefined ? c.label : '', value: i });
    }
  }

  private buildVerticalColumns() {
    this.rows = [];
    this.headers = [];
    let categories: any[] = [];
    const rep = this.managedRepresentation;
    if (rep !== undefined && rep.children !== undefined) {
      categories = rep.children;
    }
    for (let i = this.min; i <= this.max; i++) {
      const c = categories
        .find(category => category.code && category.code.getValue() === i);
      this.rows.push({ label: c !== undefined ? c.label : '', value: i });
    }
  }


}
