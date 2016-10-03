import { Component, Input } from '@angular/core';

@Component({
  selector: 'responsedomain-categorylist',
  moduleId: module.id,
  template: `<div class="row">
             <p *ngFor="let code of codes; let idx=index">
             <input name="codegroup" type="radio" id="code{{idx}}" />
             <label [attr.for]="'code' + idx">{{code}}</label>
             </p>
             </div>`,
  styles: [],
})

export class ResponsedomainCategoryListComponent {
  @Input() codes: string[];
}
