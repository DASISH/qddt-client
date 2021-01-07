import { Component, OnChanges, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import { StatementConstruct, Parameter, hasChanges } from '../../../lib';

@Component({
  selector: 'qddt-preview-statementconstruct',
  template: `
  <ul *ngIf="statement">
    <qddt-parameter [inParameters]="statement.parameterIn" [parameters]="inParameters" >
    </qddt-parameter>
    <li class="collection-item" >
      <p class="card-panel grey lighten-5 grey-text text-darken-1 flow-text" [innerHtml]="insertParam(statement?.statement)" style="font-style: italic"></p>
    </li>
  </ul>
`,
})

export class PreviewStatementConstructComponent implements OnChanges {
  @Input() statement: StatementConstruct;
  @Input() inParameters: Map<string, Parameter>

  public ngOnChanges(changes: SimpleChanges): void {

    if (hasChanges(changes.statement) && changes.statement.currentValue.parameterIn.length > 0) {
      this.assignValueToParameters(this.statement.parameterIn);
    }

    if (changes.parameterIn && changes.parameterIn.currentValue
      && this.statement && this.statement.parameterIn.length > 0) {
      this.assignValueToParameters(this.statement.parameterIn);
    }
  }


  private assignValueToParameters(inParameters: Parameter[]) {
    console.debug('break here');
    if ((!inParameters) || (!this.inParameters)) {
      return;
    }

    // const reversed = this.inParameters.values
    inParameters.forEach((p, i, refArray) => {
      // if (!p.referencedId) {
      //   const found = reversed.find(o => o[1].name === p.name);
      //   if (found) {
      //     p.referencedId = found[1].id;
      //   }
      // }
      if (p.referencedId) {
        console.debug('assignValueToStatementParameters');
        p.value = this.inParameters.get(p.referencedId).value;
      }
      // refArray[i] = p;
    });
  }

  // private assignValueToParameters(inParameters: Parameter[]) {
  //   const reversed = [...this.inParameters.entries()].reverse();
  //   inParameters.forEach((p, i, refArray) => {
  //     if (!p.referencedId) {
  //       const found = reversed.find(o => o[1].name === p.name);
  //       if (found) {
  //         p.referencedId = found[1].id;
  //       }
  //     }
  //     if (p.referencedId) {
  //       p.value = this.inParameters.get(p.referencedId).value;
  //     }
  //     console.debug(refArray[i] || JSON);
  //     refArray[i] = p;
  //     console.debug(refArray[i] || JSON);
  //   });
  // }

  public insertParam(text: string): string {
    if (this.statement && this.statement.parameterIn) {
      this.statement.parameterIn.forEach(p => {
        if (p.value) {
          text = text.replace(
            new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => (pp.label) ? pp.label : pp.value).join(',') + '</mark>');
        }
      });
    }
    return text;
  }
}
