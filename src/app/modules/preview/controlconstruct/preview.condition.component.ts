import { instructionRoutes } from './../../instruction/instruction.routes';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConditionConstruct, Parameter, UserResponse, tryParse, isParamTrue, isBoolean, isObject } from '../../../lib';

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

  private get outParameter() {
    return (this.condition && this.condition.outParameter && this.condition.outParameter.length === 1) ?
      this.condition.outParameter[0] : null;
  }

  private isDifferent = (current: Map<string, Parameter>, prior: Map<string, Parameter>) => {
    if (!current) return false;
    if (!prior) return true;
    if (current.size !== prior.size) return true;

    for (let key in current.keys()) {
      if (!current.get(key).equals(prior.get(key)))
        return false;
    }
    return true;
  }

  public ngOnChanges(changes: SimpleChanges): void {

    if (this.isDifferent(changes.inParameters.currentValue, changes.inParameters.previousValue)
      && this.condition && this.condition.condition.condition) {
      let expression = this.condition.condition.condition.content
      let label = expression;
      this.assignReferenceAndValueTo(this.condition.inParameter);
      this.condition.inParameter.forEach(p => {
        if (p.value) {
          expression = expression.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), '[' + p.value.map(pp => pp.value).join(',').toString() + ']');
          label = label.replace(
            new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => pp.label || pp.value)
              .join(',') + '</mark>');
        }
      });

      this.assignValueToOutPutParameter(expression);
      this.innerHtml = label + ' = ' + this.outParameter.value[0].value || '?' + '\nRef: ' + this.condition.condition.ref;
    }
  }

  private reversed = () => [...this.inParameters.entries()].reverse();

  private Idx = () => this.reversed().findIndex(pre => pre[0] === this.condition.outParameter[0].id);

  // UPDATES inputvariables, triggers a new changes.condition
  private assignReferenceAndValueTo(parameters: Parameter[]) {
    const reversed = this.reversed();
    parameters.forEach((p, i, refArray) => {
      if (!p.referencedId) {
        // console.log('assignReference ' + i);
        const find = reversed.find(o => o[1].name === p.name);
        if (find) {
          p.referencedId = find[1].id;
        }
      }
      if (p.referencedId) {
        console.log('assignValue ' + i);
        p.value = this.inParameters.get(p.referencedId).value;
      }
      refArray[i] = p;
    });

    // updates [INPUTxx] parameters
    const thisIdx = this.Idx();
    if (thisIdx >= 0) {
      const searchables = reversed.filter((p, i) => i >= thisIdx);
      parameters
        .filter(f => f.name.startsWith('INPUT'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((para, index) => {
          if (searchables[index + 1]) {
            para.value = searchables[index + 1][1].value;
          }
        });
    }
  }

  private assignValueToOutPutParameter(label: string) {
    if (this.outParameter && label) {
      try {

        const result = tryParse(label);
        const value = (isBoolean(result)) ? result : (isObject(result)) ? !result.done : result;
        this.outParameter.value = [new UserResponse({ label, value })];

      } catch (ex) {
        this.outParameter.value = [new UserResponse({ label, value: '?' })];
        throw ex;
      }
    }
  }

}
