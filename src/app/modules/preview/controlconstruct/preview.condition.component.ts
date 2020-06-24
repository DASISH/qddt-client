import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConditionConstruct, Parameter, ConRef, UserResponse, tryParse, isParamTrue, isConRef } from '../../../lib';

@Component({
  selector: 'qddt-preview-conditionconstruct',
  template: `
    <ul *ngIf="condition">
      <qddt-parameter [inParameters]="condition.inParameter" [outParameters]="condition.outParameter">
      </qddt-parameter>
      <li class="collection-item card-panel" >
        <p><label>Condition</label></p>
        <code [innerHtml]="insertParam(condition.condition)"> </code>
        <p><label>Ref</label></p>
        <p>{{condition?.condition?.ref?.toString()}}</p>
      </li>
  </ul>
  `,
})

export class PreviewConditionConstructComponent implements OnChanges {
  @Input() condition: ConditionConstruct;
  @Input() inParameters: Map<number, Parameter>;
  @Input() showDetail = true;


  public readonly isParamTrueRef = isParamTrue;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.inParameters && changes.inParameters.currentValue && this.condition) {
      const params = [...this.inParameters.values()];
      this.condition.inParameter =
        this.condition.inParameter
          .map(obj => params.find(o => o.name === obj.name) || obj);

      const idx = params.findIndex(p => p.referencedId === this.condition.outParameter[0].referencedId);

      if (idx >= 0) {
        this.condition.inParameter
          .filter(f => f.name.startsWith('INPUT'))
          .forEach((para, index) => {
            if (this.inParameters[idx - (index + 1)]) {
              para.value = this.inParameters[idx - (index + 1)].value;
            }
          });
      }
    }
  }

  public insertParam(conref: ConRef | string): string {
    let text = isConRef(conref) ? (conref as ConRef).condition.content : conref;
    let label = text;

    if (this.condition && this.condition.inParameter) {
      this.condition.inParameter.forEach(p => {
        if (p.value) {
          label = label.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), p.value[0].value.toString());
          text = text.replace(
            new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => pp.label || pp.value)
              .join(',') + '</mark>');
        }
      });
      const outp = this.condition.outParameter;
      if (outp && outp.length === 1 && label) {
        try {
          outp[0].value = [new UserResponse({ label, value: tryParse(label).toString() })];
        } catch (Ex) {
          outp[0].value = [new UserResponse({ label, value: '?' })];
        }
        return text + ' = ' + outp[0].value[0].value || '?' +
          '\nRef: ' + (conref as ConRef).ref;
      }
    }
    return text + isConRef(conref) ? '\nRef: ' + (conref as ConRef).ref : '';
  }

}
