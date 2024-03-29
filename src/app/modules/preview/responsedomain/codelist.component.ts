import { Component, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { lookupService } from 'dns';
import { Category, ResponseCardinality, UserResponse, Parameter } from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-rd-codelist',
  template: `
<ul *ngIf="managedRepresentation">
    <li *ngFor="let row of rows;" >
      <span class="codeValue"> {{ row.value }} </span>
      <label>
        <input [name]="inputGroupName" [type]="type" [disabled]="row.disabled"  (change)="checkOption(row, $event)"/>
        <span>{{insertParam(row.label)}}</span>
      </label >
    </li>
</ul>
`,
})

export class ResponsedomainCodeListComponent implements OnChanges {
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();
  @Input() managedRepresentation: Category;
  @Input() inputGroupName = 'option-select'
  @Input() parameterIn: Parameter[] = [];

  public compId = Math.round(Math.random() * 10000);
  public rows: UserResponse[] = [];
  public type: string;

  public checked() { return this.rows.filter((e: any) => e.checked).length; }

  public ngOnChanges(changes: SimpleChanges): void {
    console.debug('oncahnges....')
    this.rows = [];
    const rep = this.managedRepresentation;

    for (const c of rep.anchors) {
      this.rows.push(
        { label: c.label,
          value: c.code.value,
          checked: false } as UserResponse
        );
    }

      this.type = (+rep.inputLimit.maximum > 1) ? 'checkbox' : 'radio';

  }

  public insertParam(text: string): string {
    this.parameterIn.forEach(p => {
      if (p.value) {
        text = text.replace(
          new RegExp('\\[' + p.name + '\\]', 'ig'), p.value.map(pp => (pp.label) ? pp.label : pp.value).join(','));
      }
    });
    return text;
  }

  public checkOption(row: any, event: any) {
    try {
      if (this.type === 'radio') {
        this.rows.forEach(item => item.checked = false);
      }
      row.checked = event.target.checked;
      if (this.type === 'checkbox') {
        if (this.rows.filter((e: any) => e.checked).length >= this.managedRepresentation.inputLimit.maximum) {
          this.rows.filter((e: any) => !e.checked).forEach(e => e.disabled = 'true');
        } else {
          this.rows.forEach((e: any) => e.disabled = '');
        }
        this.selectedEvent.emit([...this.rows.filter(e => e.checked)
          .map((e: UserResponse) => {
            return {
              label: this.insertParam(e.label),
              value: e.value } as UserResponse;
          })]);
      } else {
        this.selectedEvent.emit([{ label: this.insertParam(row.label), value: row.value }]);
      }
    } catch (ex) {
      console.error(ex);
      throw ex;
    }
  }
}
