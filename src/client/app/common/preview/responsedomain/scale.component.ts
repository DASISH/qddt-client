import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../../components/responsedomain/responsedomain.service';
import { Category, Code } from '../../../components/category/category.service';

@Component({
  selector: 'qddt-preview-rd-scale',
  moduleId: module.id,
  templateUrl: './scale.component.html',
  styles: ['table .text-center {text-align: center;}'
          ,'table .text-left {text-align: left;}',
          'table .text-right {text-align: right;}'],
})

export class ResponsedomainScaleComponent implements OnChanges {
  @Input() responseDomain: ResponseDomain;
  private header: any[] = [];
  private row: any[] = [];
  private max: number = 8;
  private min: number = 1;
  private displayLayout: number = 0;

  ngOnChanges() {
    let rep = this.responseDomain.managedRepresentation;
    this.row = [];
    this.header = [];
    if (rep !== undefined
      && rep.inputLimit !== undefined
      && rep.inputLimit.maximum !== undefined) {
      this.max = rep.inputLimit.maximum;
    }
    if (rep !== undefined
      && rep.inputLimit !== undefined
      && rep.inputLimit.minimum !== undefined) {
      this.min = rep.inputLimit.minimum;
    }
    let layout = this.responseDomain['displayLayout'];
    this.displayLayout = layout === 0 || layout === '0' ? 0 : 90;

    if (this.displayLayout > 0) {
      this.buildVerticalRows();
    } else {
      this.buildHorizontalRows();
    }
  }

  rotate() {
    if(this.displayLayout === 0) {
      this.displayLayout = 90;
      this.responseDomain['displayLayout'] = 90;
      this.buildVerticalRows();
    } else {
      this.displayLayout = 0;
      this.responseDomain['displayLayout'] = 0;
      this.buildHorizontalRows();
    }
  }

  private buildHorizontalRows() {
    this.row = [];
    this.header = [];
    let categories: Category[] = [];
    let colspan: number=0;
    let usedCols: number=0;
    let rep = this.responseDomain.managedRepresentation;

    if (rep !== undefined && rep.children !== undefined) {
      let numberOfcols = rep.inputLimit.maximum - rep.inputLimit.minimum + 1;
      categories = rep.children.map(x => Object.assign({}, x)).sort(function(a, b) {
        return  parseInt(a.code.codeValue) - parseInt(b.code.codeValue);} ); //copy array, no reference
      colspan = Math.floor(numberOfcols / categories.length);
      colspan = (colspan>3)?3:colspan;

      for (let i = 0; i < categories.length; i++) {
        if (categories[i].code === undefined ) {
          categories[i].code = new Code();
          categories[i].code.codeValue =  (rep.inputLimit.minimum + (i*colspan)).toString();
        }
        let nextcol = parseInt(categories[i].code.codeValue)-rep.inputLimit.minimum;

        if (usedCols+1 <= nextcol) {
          if (nextcol+usedCols+colspan > numberOfcols)
            nextcol = numberOfcols - colspan;
          if ((nextcol-usedCols >0)) {
            this.header.push({
              label: '',
              colspan: (nextcol - usedCols),
              width: (nextcol - usedCols) / numberOfcols * 100
            });
            usedCols += (nextcol - usedCols);
          }
        }
        this.header.push({label: categories[i].label,
          colspan: colspan,
          class: categories[i].code.alignment,
          width:colspan/numberOfcols*100});
        usedCols += colspan;
      }
    }
    for (let i = this.min; i <= this.max; i++) {
      let c = categories
        .find(category => category.code && category.code.codeValue === i.toString());
      this.row.push({ label: c !== undefined ? c.label : '', value: i });
    }
  }

  private buildVerticalRows() {
    this.row = [];
    this.header = [];
    let categories: any[] = [];
    let rep = this.responseDomain.managedRepresentation;
    if (rep !== undefined && rep.children !== undefined) {
      categories = rep.children;
    }
    for (let i = this.min; i <= this.max; i++) {
      let c = categories
        .find(category => category.code && category.code.codeValue === i.toString());
      this.row.push({ label: c !== undefined ? c.label : '', value: i ,class:'text-left'});
    }
  }
}
