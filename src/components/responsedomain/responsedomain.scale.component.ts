import {Component, Input} from 'angular2/core';

@Component({
  selector: 'responsedomain-scale',
  moduleId: module.id,
  template: `<div class="row">
        <table>
        <thead>
          <tr>
            <th *ngFor="#item of header">
             <span>
             <label>{{item}}</label>
             </span>
            </th>
            <th *ngIf="missingLabel">
             <span>
             <label class="#ffebee red lighten-5">{{missingLabel}}</label>
             </span>
            </th>
          </tr>
        </thead>

        <tbody><tr>
            <td *ngFor="#option of options;#idx=index">
             <span>
             <input name="group" type="radio" id="option{{idx}}" />
             <label [attr.for]="'option' + idx">{{idx}}</label>
             </span>
            </td>
            <td *ngIf="missingCode">
             <span>
             <input name="group" type="radio" id="missing-{{missingCode}}" />
             <label  class="#ffebee red lighten-5" [attr.for]="'missing-' + missingCode">{{missingCode}}</label>
             </span>
            </td>
          </tr></tbody></table></div>`,
  styles: [],
  pipes: [],
  directives: []
})

export class ResponsedomainScaleComponent {
  @Input() n: number;
  @Input() header: any;
  @Input() missingCode: any;
  @Input() missingLabel: any;
  private options: any[];

  ngOnInit() {
    this.options = Array(this.n).fill(0).map((e,i)=>i+1);
  }
}
