import {Component, Input} from 'angular2/core';

@Component({
  selector: 'responsedomain-codelist',
  moduleId: module.id,
  template: `<div class="row">
             <p *ngFor="#code of codes;#idx=index">
             <input name="codegroup" type="radio" id="code{{idx}}" />
             <label [attr.for]="'code' + idx">{{code}}</label>
             </p>
             </div>`,
  styles: [],
  pipes: [],
  directives: []
})

export class ResponsedomainCodeListComponent {
  @Input() codes: string[];
}
