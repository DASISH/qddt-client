import {Component, Input} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';

@Component({
  selector: 'responsedomain-scale',
  moduleId: module.id,
  template: `<div *ngIf="responseDomain" class="row">
        <table>
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
              <input name="{{responseDomain.id}}-group" type="radio" id="{{responseDomain.id}}option{{option}}" />
              <label [attr.for]="responseDomain.id + 'option' + option">{{option}}</label>
              </span>
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
    let categories = [];
    if (rep !== undefined && rep.children !== undefined) {
      categories = rep.children;
    }

    for (let i = this.min; i <= this.max; i++) {
      this.row.push(i);
      let c = categories
        .find(category => category.code.codeValue === i.toString());
      if(c !== undefined) {
        this.header.push(c.label);
      } else {
        this.header.push('');
      }
    }
  }
}
