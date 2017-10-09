import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../../components/responsedomain/responsedomain.service';

@Component({
  selector: 'qddt-preview-rd-codelist',
  moduleId: module.id,
  template: `<div class="row" *ngIf="responseDomain">
             <ul><li *ngFor="let row of rows" class="row">
               <input name="{{responseDomain?.id}}-codegroup" type="{{type}}"
                 id="{{responseDomain?.id}}code{{row?.code}}"
                 [disabled]="row.disabled"
                 (change)="checkOption(row, $event)"/>
               <label [attr.for]="responseDomain.id + 'code' + row.code">{{row?.label}}</label>
               <span class="right"> {{row?.code}}</span>
             </li></ul>
             </div>`,
  styles: [],
})

export class ResponsedomainCodeListComponent implements OnChanges {
  @Input() responseDomain: ResponseDomain;

  private rows: any[] = [];
  private max: number = 4;
  private min: number = 1;
  private type: string;
  private responseMax: number;

  ngOnChanges() {
    this.rows = [];
    let rep = this.responseDomain.managedRepresentation;
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
    let categories: any[] = [];
    if (rep !== undefined && rep.children !== undefined) {
      categories = rep.children;
    }
    for (let c of categories) {
      this.rows.push({ 'label': c.label, 'code': c.code.codeValue, 'checked': false });
    }
    this.type = 'radio';
    if (this.responseDomain['responseCardinality'] !== undefined) {
      this.responseMax = this.responseDomain['responseCardinality']['maximum'] || 1;
      if (this.responseMax > 1) {
        this.type = 'checkbox';
      }
    }
  }

  checkOption(row: any, event: any) {
    row.checked = event.target.checked;
    if (this.type === 'checkbox') {
      if (this.rows.filter((e: any) => e.checked).length >= this.responseMax) {
        this.rows.filter((e: any) => !e.checked).forEach(e => e.disabled = 'disabled');
      } else {
        this.rows.forEach((e: any) => e.disabled = '');
      }
    }
  }
}
