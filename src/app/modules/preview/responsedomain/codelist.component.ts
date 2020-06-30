import { Component, Input, OnChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Category, ResponseCardinality, UserResponse } from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-rd-codelist',

  template: `
<ng-container *ngIf="managedRepresentation">
  <!-- <ul [id]="'UL-' + compId" > -->
    <div *ngFor="let row of rows; trackBy:trackByIndex;" >
      <span class="codeValue"> {{ row.value }} </span>
      <label>
        <input [name]="inputGroupName" [type]="type" [disabled]="row.disabled"  (change)="checkOption(row, $event)"/>
        <span>{{row.label}}</span>
      </label >
    </div>
  <!-- </ul> -->
</ng-container>
`,
})

export class ResponsedomainCodeListComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() responseCardinality: ResponseCardinality;
  @Input() inputGroupName = 'option-select'

  public compId = Math.round(Math.random() * 10000);
  public rows: UserResponse[] = [];
  public type: string;


  public ngOnChanges() {
    this.rows = [];
    const rep = this.managedRepresentation;

    for (const c of rep.children) {
      const newLocal = { label: c.label, value: c.code.codeValue, checked: false } as UserResponse;
      this.rows.push(newLocal);
    }

    this.type = (+this.responseCardinality.maximum > 1) ? 'checkbox' : 'radio';

  }

  public checkOption(row: any, event: any) {
    try {
      row.checked = event.target.checked;
      // console.log('check here?');
      if (this.type === 'checkbox') {
        if (this.rows.filter((e: any) => e.checked).length >= this.responseCardinality.maximum) {
          this.rows.filter((e: any) => !e.checked).forEach(e => e.disabled = 'true');
        } else {
          this.rows.forEach((e: any) => e.disabled = '');
        }
        this.selectedEvent.emit([...this.rows.filter(e => e.checked)
          .map((e: UserResponse) => {
            const newLocal = { label: e.label, value: e.value } as UserResponse;
            return newLocal;
          })]);
      } else {
        this.selectedEvent.emit([{ label: row.label, value: row.value }]);
      }
    } catch (ex) {
      console.log(ex);
      throw ex;
    }
  }

  public trackByIndex = (index: number): number => {
    return index;
  };
}
