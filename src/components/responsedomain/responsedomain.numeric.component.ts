import {Component, Input} from 'angular2/core';

@Component({
  selector: 'responsedomain-numeric',
  moduleId: module.id,
  template: `<div class="row">
        <table>
        <tbody><tr>
            <td *ngFor="#option of options;#idx=index">
             <span>
             <input name="group" type="radio" id="option{{idx}}" />
             <label [attr.for]="'option' + idx">{{idx}}</label>
             </span>
            </td>
          </tr></tbody></table></div>`,
  styles: [],
  pipes: [],
  directives: []
})

export class ResponsedomainNumericComponent {
  @Input() n: number;
  @Input() start: string;
  @Input() end: string;
  private options: any[];
  private header: string[];

  ngOnInit() {
    this.options = Array(this.n).fill(0).map((e,i)=>i+1);
    this.header = Array(this.n).fill('');
    this.header[0] = this.start;
    this.header[this.n - 1] = this.end;
  }
}
