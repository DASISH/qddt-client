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
        <code [innerHtml]="innerHtml"> </code>
        <p><label>Ref</label></p>
        <p>{{condition?.condition?.ref?.toString()}}</p>
      </li>
  </ul>
  `,
})

export class PreviewConditionConstructComponent implements OnChanges {
  @Input() condition: ConditionConstruct;
  @Input() inParameters: Map<string, Parameter>;
  @Input() showDetail = true;

  public innerHtml = '';

  public readonly isParamTrueRef = isParamTrue;

  public ngOnChanges(changes: SimpleChanges): void {

    if (changes.condition && changes.condition.currentValue) {
      this.condition = new ConditionConstruct(changes.condition.currentValue);
      this.assignValueToParameters(this.condition.inParameter);
      this.innerHtml = this.insertParam(this.condition.condition);
    }

    if (changes.inParameters && changes.inParameters.currentValue && this.condition) {
      this.assignValueToParameters(this.condition.inParameter);
      this.innerHtml = this.insertParam(this.condition.condition);
    }
  }

  private assignValueToParameters(inParameters: Parameter[]) {
    const reversed = [...this.inParameters.entries()].reverse();
    const thisIdx = reversed.findIndex(pre => pre[0] === this.condition.outParameter[0].id);
    const searchables = reversed.filter((p, i) => i >= thisIdx);

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

    if (thisIdx >= 0) {
      this.condition.inParameter
        .filter(f => f.name.startsWith('INPUT'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((para, index) => {
          if (searchables[index + 1]) {
            para.value = searchables[index + 1][1].value;
          }
        });
    }
  }


  public insertParam(conref: ConRef | string): string {
    let text = isConRef(conref) ? (conref as ConRef).condition.content : conref;
    let label = text;

    if (this.condition && this.condition.inParameter) {
      this.condition.inParameter.forEach(p => {
        if (p.value) {
          label = label.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), '[' + p.value.map(pp => pp.value).join(',').toString() + ']');
          text = text.replace(
            new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => pp.label || pp.value)
              .join(',') + '</mark>');
        }
      });
      const outp = this.condition.outParameter;
      if (outp && outp.length === 1 && label) {
        try {
          const result = tryParse(label);
          const value = (result || JSON).done || result;
          console.log(value);
          outp[0].value = [new UserResponse({ label, value })];
        } catch (Ex) {
          outp[0].value = [new UserResponse({ label, value: '?' })];
        }
      }
      return text + ' = ' + outp[0].value[0].value || '?' + '\nRef: ' + (conref as ConRef).ref;
    }
    return text + isConRef(conref) ? '\nRef: ' + (conref as ConRef).ref : '<NOT INITIALIZED>';
  }

}
