import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { StatementConstruct, Parameter } from '../../../lib';

@Component({
  selector: 'qddt-preview-statementconstruct',

  template: `
  <ul>
    <ng-container *ngIf="statement?.inParameter?.length>0">
    <li class="collection-item"><label>Parameters</label></li>
    <li class="collection-item chip" title="In parameter" *ngFor="let parameter of statement.inParameter">{{getParam(parameter,'🢩')}} </li>
    </ng-container>
  <li class="collection-item" >
    <p [innerHtml]="insertParam(statement?.statement)" style="font-style: italic"></p>
  </li>
</ul>
`,
  styles: [
  ],
  providers: [],
})

export class PreviewStatementConstructComponent implements OnChanges {
  @Input() statement: StatementConstruct;
  @Input() inParameters: Parameter[];
  @Input() showDetail = true;

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.statement && changes.inParameters && changes.inParameters.currentValue) {
      this.statement.inParameter =
        this.statement.inParameter.map(obj => this.inParameters.find(o => o.name === obj.name) || obj);
    }
  }

  public getParam(param: Parameter, divider: string): string {
    return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
  }

  public insertParam(text: string): string {
    if (this.statement && this.statement.inParameter) {
      this.statement.inParameter.forEach(p => {
        if (p.value) {
          text = text.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => pp.label).join(',') + '</mark>');
        }
      });
    }
    return text;

  }
}
