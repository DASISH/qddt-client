import { Component, Input, OnChanges } from '@angular/core';
import { ResponseDomain } from '../../responsedomain/responsedomain.classes';
import { Category, ResponseCardinality } from '../../category/category.classes';

@Component({
  selector: 'qddt-preview-rd-codelist',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="managedRepresentation">
     <ul>
       <li *ngFor="let row of rows" class="row">
         <input name="{{managedRepresentation?.id}}-codegroup" type="{{type}}"
           id="{{managedRepresentation?.id}}code{{row?.code}}"
           [disabled]="row.disabled"
           (change)="checkOption(row, $event)"/>
         <label [attr.for]="managedRepresentation.id + 'code' + row.code">{{ row?.label }}</label>
         <span class="right"> {{ row?.code }}</span>
       </li>
     </ul>
     </div>`,
  styles: [],
})

export class ResponsedomainCodeListComponent implements OnChanges {
  @Input() managedRepresentation: Category;
  @Input() responseCardinality: ResponseCardinality;
  public rows: any[] = [];
  public type: string;

  ngOnChanges() {
    this.rows = [];
    const rep = this.managedRepresentation;

    for (const c of rep.children) {
      this.rows.push({ 'label': c.label, 'code': c.code.codeValue, 'checked': false });
    }

    this.type = (+this.responseCardinality.maximum > 1) ? 'checkbox' : 'radio';

  }

  checkOption(row: any, event: any) {
    row.checked = event.target.checked;
    if (this.type === 'checkbox') {
      if (this.rows.filter((e: any) => e.checked).length >= this.responseCardinality.maximum) {
        this.rows.filter((e: any) => !e.checked).forEach(e => e.disabled = 'disabled');
      } else {
        this.rows.forEach((e: any) => e.disabled = '');
      }
    }
  }
}
