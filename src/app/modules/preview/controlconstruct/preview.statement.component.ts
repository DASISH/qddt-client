import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { StatementConstruct, Parameter } from '../../../lib';

@Component({
  selector: 'qddt-preview-statementconstruct',
  template: `
  <ul *ngIf="statement">
    <qddt-parameter [inParameters]="statement.inParameter" [outParameters]="statement.outParameter">
    </qddt-parameter>
    <li class="collection-item" >
      <p [innerHtml]="insertParam(statement?.statement)" style="font-style: italic"></p>
    </li>
  </ul>
`,
})

export class PreviewStatementConstructComponent implements OnChanges {
  @Input() statement: StatementConstruct;
  @Input() inParameters: Map<number, Parameter>

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.inParameters && changes.inParameters.currentValue
      && this.statement && this.statement.inParameter.length > 0) {
      const params = [...this.inParameters.values()];
      this.statement.inParameter = [].concat(
        ...this.statement.inParameter.map(obj => params.find(o => o.name === obj.name) || obj));
    }
  }

  public insertParam(text: string): string {
    if (this.statement && this.statement.inParameter) {
      this.statement.inParameter.forEach(p => {
        if (p.value) {
          text = text.replace(
            new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => (pp.label) ? pp.label : pp.value).join(',') + '</mark>');
        }
      });
    }
    return text;
  }
}
