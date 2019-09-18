import { Component, Input, OnChanges } from '@angular/core';
import { Category, Code } from '../../../lib/classes';

class ScaleHead {
  colspan: number;
  class: string;
  label: string;
  width: number;
}

class Column {
  value: number;
  label: string;
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




export class ResponsedomainScaleComponent implements OnChanges {
  @Input() managedRepresentation: Category;
  @Input() displayLayout = 0;
  @Input() numOfRows = 1;
  public headers: ScaleHead[];
  public columns: Column[];
  public rows: any;
  public max = 5;
  public min = 1;

  ngOnChanges() {
    if (this.managedRepresentation) {
      // console.log('ResponsedomainScaleComponent ngOnChanges doing');
      const rep = this.managedRepresentation;
      this.columns = [];
      this.headers = [];
      this.rows = new Array(this.numOfRows).fill(1);

      if (rep.inputLimit) {
        this.max = +rep.inputLimit.maximum;
        this.min = +rep.inputLimit.minimum;
      }

      if (this.displayLayout > 0) {
        this.buildVerticalColumns();
      } else {
        this.buildHorizontalColumns();
      }
    }
    // console.log('ResponsedomainScaleComponent ngOnChanges done');
  }


  private buildHorizontalColumns() {
    this.columns = [];
    this.headers = [];

    let usedCols = 0;
    const rep = this.managedRepresentation;

    if (!rep) { return; }

    function getAlignment(category: Category, islast: boolean) {
      if (!category.code.alignment) {
        return (islast) ? 'text-right' : 'text-left';
      }
      return category.code.alignment;
    }

    function minDistance(c: Category[]): number {
      if (!c || c.length < 2) { return 0; }
      let minDiff = parseInt(c[1].code.codeValue) - parseInt(c[0].code.codeValue);
      for (let i = 2 ; i !== c.length ; i++) {
        minDiff = Math.min(minDiff, parseInt(c[i].code.codeValue) - parseInt(c[i - 1].code.codeValue));
      }
      if (rep.inputLimit.maximum < 4 ) {
        minDiff = 1;
      }
      return (minDiff > 3) ? 3 : minDiff;
    }

    const numberOfcols = this.max - this.min + 1;
    const categories = rep.children
      .map(x => Object.assign({}, x))
      .sort(function(a, b) { return  parseInt(a.code.codeValue) - parseInt(b.code.codeValue); } );

    const colspan = minDistance(categories);


    for (let i = 0; i < categories.length; i++) {
      if (categories[i].code === undefined) {
        categories[i].code = new Code();
        categories[i].code.codeValue = (this.min + (i * colspan)).toString();
      }
      let nextcol = parseInt(categories[i].code.codeValue) - this.min;

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
        colspan: colspan,
        class:  alignment,
        width: colspan / numberOfcols * 100
      });
      usedCols += colspan;
    }
    for (let i = this.min; i <= this.max; i++) {
      const c = categories
        .find(category => category.code && category.code.codeValue === i.toString());
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
        .find(category => category.code && category.code.codeValue === i.toString());
      this.rows.push({ label: c !== undefined ? c.label : '', value: i });
    }
  }


}
