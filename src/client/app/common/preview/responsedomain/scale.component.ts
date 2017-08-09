import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../../components/responsedomain/responsedomain.service';
import { Category, Code } from '../../../components/category/category.service';
import { isNullOrUndefined, isUndefined } from 'util';

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
    let colspanCenter: number=0;
    let center: number= -1;
    let rep = this.responseDomain.managedRepresentation;

    if (rep !== undefined && rep.children !== undefined) {
      let cols = rep.inputLimit.maximum - rep.inputLimit.minimum + 1;
      categories = rep.children.map(x => Object.assign({}, x)); //copy array, no reference
      colspan = Math.floor(cols / categories.length);

      if (categories.length % 2 > 0) {        // if odd number of Cats, add unused columns to center Cat
        colspanCenter = cols % categories.length + colspan;
        center = Math.floor(categories.length / 2);

      } else if (colspan * categories.length !== cols) { // if even number of Cats and we have unused columns, add a Cat with unused columns
        colspanCenter = cols % rep.children.length;
        categories.splice(Math.floor(categories.length / 2), 0, new Category());
        center = Math.floor(categories.length / 2);

      }  //even number of Cats and no unused columns, do nothing...

      for (let i = 0; i < categories.length; i++) {
        if (categories[i].code === undefined ) {
          categories[i].code = new Code();
        }

        if (categories[i].code.alignment === '' ) {
          categories[i].code.alignment = 'text-left';
        }
        if (i === center)
          this.header.push({label: categories[i].label, colspan: colspanCenter,
            class: categories[i].code.alignment, width:colspanCenter/cols*100});
        else
          this.header.push({label: categories[i].label, colspan: colspan,
            class: categories[i].code.alignment, width:colspan/cols*100});
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
