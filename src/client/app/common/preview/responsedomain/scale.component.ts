import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../../components/responsedomain/responsedomain.service';

@Component({
  selector: 'qddt-preview-rd-scale',
  moduleId: module.id,
  template: `<div *ngIf="responseDomain" class="row">
        <table *ngIf="displayLayout === 0">
        <thead>
          <tr>
            <th *ngFor="let item of header">
             <span>
             <label>{{item}}</label>
             </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td *ngFor="let option of row; let idx=index">
              <span>
              <input name="{{responseDomain.id}}-group" type="radio" id="{{responseDomain.id}}option{{option.value}}" />
              <label [attr.for]="responseDomain.id + 'option' + option.value">{{option?.value}}</label>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <table *ngIf="displayLayout > 0">
        <tbody>
          <tr *ngFor="let option of row; let idx=index">
            <td>
              <span>
              <input name="{{responseDomain.id}}-group" type="radio" id="{{responseDomain.id}}option{{option.value}}" />
              <label [attr.for]="responseDomain.id + 'option' + option.value">{{option?.label}}</label>
              </span>
            </td>
            <td>
              <span>{{option?.value}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`,
  styles: [],
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
      this.max = parseInt(rep.inputLimit.maximum);
    }
    if (rep !== undefined
      && rep.inputLimit !== undefined
      && rep.inputLimit.minimum !== undefined) {
      this.min = parseInt(rep.inputLimit.minimum);
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
    let categories: any[] = [];
    let rep = this.responseDomain.managedRepresentation;
    if (rep !== undefined && rep.children !== undefined) {
      categories = rep.children;
    }
    for (let i = this.min; i <= this.max; i++) {
      let c = categories
        .find(category => category.code && category.code.codeValue === i.toString());
      this.row.push({ label: c !== undefined ? c.label : '', value: i });
      if (c !== undefined) {
        this.header.push(c.label);
      } else {
        this.header.push('');
      }
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
      this.row.push({ label: c !== undefined ? c.label : '', value: i });
    }
  }
}
