import {Component, Input} from 'angular2/core';
import {ResponseDomain} from './responsedomain.service';

@Component({
  selector: 'responsedomain-codelist',
  moduleId: module.id,
  template: `<div class="row">
             <ul><li *ngFor="#row of rows"  class="row">
               <input name="{{responseDomain.id}}-codegroup" type="{{type}}"
                 id="{{responseDomain.id}}code{{row.code}}"
                 [disabled]="row.disabled"
                 (change)="checkOption(row, $event)"/>
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
  private type: string;
  private responseMax: number;

  ngOnInit() {
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
      this.rows.push({ 'label': c.label, 'code': c.code.codeValue, 'checked': false });
    }
    this.type = 'radio';
    if (this.responseDomain['responseCardinality'] !== undefined) {
      this.responseMax = parseInt(this.responseDomain['responseCardinality']['maximum'] || 1);
      if (this.responseMax > 1) {
        this.type = 'checkbox';
      }
    }
  }

  checkOption(row, event) {
    row.checked = event.target.checked;
    if (this.type === 'checkbox') {
      console.log(this.responseMax);
      if (this.rows.filter(e => e.checked).length >= this.responseMax) {
        this.rows.filter(e => !e.checked).forEach(e => e.disabled = 'disabled');
      } else {
        this.rows.forEach(e => e.disabled = '');
      }
    }
  }
}
