import {Component, Input} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';

@Component({
  selector: 'responsedomain-scale',
  moduleId: module.id,
  template: `<div *ngIf="responseDomain" class="row">
        <table *ngIf="degreeSlopeFromHorizontal === 0">
        <thead>
          <tr>
            <th *ngFor="#item of header">
             <span>
             <label>{{item}}</label>
             </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td *ngFor="#option of row;#idx=index">
              <span>
              <input name="{{responseDomain.id}}-group" type="radio" id="{{responseDomain.id}}option{{option.value}}" />
              <label [attr.for]="responseDomain.id + 'option' + option.value">{{option?.value}}</label>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <table *ngIf="degreeSlopeFromHorizontal > 0">
        <tbody>
          <tr *ngFor="#option of row;#idx=index">
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
  pipes: [],
  directives: []
})

export class ResponsedomainScaleComponent {
  @Input() responseDomain: ResponseDomain;
  private header: any[] = [];
  private row: any[] = [];
  private max: number = 8;
  private min: number = 1;

  private degreeSlopeFromHorizontal: number = 0;

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
    this.degreeSlopeFromHorizontal = this.responseDomain['degreeSlopeFromHorizontal'] === 0 ? 0 : 90;

    if (this.degreeSlopeFromHorizontal > 0) {
      this.buildVerticalRows();
    } else {
      this.buildHorizontalRows();
    }
  }

  rotate() {
    if(this.degreeSlopeFromHorizontal === 0) {
      this.degreeSlopeFromHorizontal = 90;
      this.buildVerticalRows();
    } else {
      this.degreeSlopeFromHorizontal = 0;
      this.buildHorizontalRows();
    }
  }

  private buildHorizontalRows() {
    this.row = [];
    this.header = [];
    let categories = [];
    let rep = this.responseDomain.managedRepresentation;
    if (rep !== undefined && rep.children !== undefined) {
      categories = rep.children;
    }
    for (let i = this.min; i <= this.max; i++) {
      let c = categories
        .find(category => category.code.codeValue === i.toString());
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
    let categories = [];
    let rep = this.responseDomain.managedRepresentation;
    if (rep !== undefined && rep.children !== undefined) {
      categories = rep.children;
    }
    for (let i = this.min; i <= this.max; i++) {
      let c = categories
        .find(category => category.code.codeValue === i.toString());
      this.row.push({ label: c !== undefined ? c.label : '', value: i });
    }
  }
}
