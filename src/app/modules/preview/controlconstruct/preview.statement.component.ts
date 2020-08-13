import { Component, OnChanges, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import { StatementConstruct, Parameter, hasChanges } from '../../../lib';

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
  @Input() inParameters: Map<string, Parameter>

  public ngOnChanges(changes: SimpleChanges): void {

    if (hasChanges(changes.statement) && changes.statement.currentValue.inParameter.length > 0) {
      this.assignValueToParameters(this.statement.inParameter);
    }

    if (changes.inParameters && changes.inParameters.currentValue
      && this.statement && this.statement.inParameter.length > 0) {
      this.assignValueToParameters(this.statement.inParameter);
    }
  }

  private assignValueToParameters(inParameters: Parameter[]) {
    const reversed = [...this.inParameters.entries()].reverse();
    inParameters.forEach((p, i, refArray) => {
      if (!p.referencedId) {
        const found = reversed.find(o => o[1].name === p.name);
        if (found) {
          p.referencedId = found[1].id;
        }
      }
      if (p.referencedId) {
        p.value = this.inParameters.get(p.referencedId).value;
      }
      refArray[i] = p;
    });
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
