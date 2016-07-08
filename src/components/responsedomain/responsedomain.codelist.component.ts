import {Component, Input} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';

@Component({
  selector: 'responsedomain-codelist',
  moduleId: module.id,
  template: `<div class="row">
             <ul><li *ngFor="#row of rows"  class="row">
               <input name="{{responseDomain.id}}-codegroup" type="radio" id="{{responseDomain.id}}code{{row.code}}" />
               <label [attr.for]="responseDomain.id + 'code' + row.code">{{row.label}}</label>
               <span class="right"> {{row.code}}</span>
             </li></ul>
             </div>`,
  styles: [],
  pipes: [],
  directives: []
})

export class ResponsedomainCodeListComponent {
  @Input() responseDomain: ResponseDomain;

  private rows: any[] = [];
  private max: number = 4;
  private min: number = 1;

  ngOnChanges() {
    this.rows = [];
    let rep = this.responseDomain.managedRepresentation;
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
    for (let c of categories) {
      this.rows.push({ 'label': c.label, 'code': c.code.codeValue });
    }
  }
}
