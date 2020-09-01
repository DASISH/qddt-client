import { hasChanges, isBoolean } from 'src/app/lib';
import { ConditionKind } from './../../../lib/classes/controlconstruct.classes';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConditionConstruct, Parameter, UserResponse, tryParse, isParamTrue } from '../../../lib';

@Component({
  selector: 'qddt-preview-conditionconstruct',
  template: `
    <ul *ngIf="construct">
      <qddt-parameter [inParameters]="construct.parameterIn" [outParameters]="construct.parameterOut" [parameters]="inParameters" >
      </qddt-parameter>
      <li class="collection-item card-panel" >

        <ng-container [ngSwitch]="construct.conditionKind">
          <ng-container *ngSwitchCase="refKind.ComputationItem"></ng-container>
          <ng-container *ngSwitchCase="refKind.IfThenElse">
            <code>
              If ({{construct.condition.ifCondition.content}}) Then Goto {{construct.condition.thenConstructReference}}
            </code>
            <li *ngFor="let item of construct.condition.elseIf">
              <code>
                Else If ({{item.ifCondition.content}}) Then Goto {{item.thenConstructReference}}
              </code>
            </li>
          </ng-container>
          <ng-container *ngSwitchCase="refKind.Loop"></ng-container>
            <li>
              <code>
                Foreach ({{getParam(construct.parameterIn[0])}}) do {{construct.condition.controlConstructReference}}
              </code>
            </li>
          <ng-container *ngSwitchCase="refKind.RepeatUntil"></ng-container>
          <ng-container *ngSwitchCase="refKind.RepeatWhile"></ng-container>
        </ng-container>
      </li>
  </ul>
  `,
})

export class PreviewConditionConstructComponent implements OnChanges {
  @Input() construct: ConditionConstruct;
  @Input() inParameters: Map<string, Parameter>;
  @Input() showDetail = true;
  @Input() get outParameter() {
    return (this.construct && this.construct.parameterOut && this.construct.parameterOut.length === 1) ?
      this.construct.parameterOut[0] : null;
  }

  public refKind = ConditionKind;
  public readonly isParamTrueRef = isParamTrue;


  public ngOnChanges(changes: SimpleChanges): void {

    if (hasChanges(changes.inParameters) && this.construct && this.construct.condition) {
      let expression = this.construct.condition.condition.content
      let label = expression;
      this.assignReferenceAndValueTo(this.construct.parameterIn);
      this.construct.parameterIn.forEach(p => {
        if (p.value) {
          expression = expression.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), '[' + p.value.map(pp => pp.value).join(',').toString() + ']');
          label = label.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => pp.label || pp.value).join(',') + '</mark>');
        }
      });

      this.assignValueToOutPutParameter(expression);
      // this.innerHtml = label + ' = ' + this.outParameter.value[0].value || '?' + '\nRef: ' + this.construct.condition.ref;
    }
  }

  private reversed = () => [...this.inParameters.entries()].reverse();

  private Idx = () => this.reversed().findIndex(pre => pre[0] === this.construct.parameterOut[0].id);

  // UPDATES inputvariables, triggers a new changes.condition
  private assignReferenceAndValueTo(parameters: Parameter[]) {
    const reversed = this.reversed();
    const thisIdx = this.Idx();
    if (thisIdx >= 0) {
      const searchables = reversed.filter((p, i) => i >= thisIdx);
      parameters
        .filter(f => f.name.startsWith('INPUT'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((para, index) => {
          if (searchables[index + 1] && !para.referencedId) {
            para.referencedId = searchables[index + 1][0]
          }
        });
    }
  }

  private assignValueToOutPutParameter(label: string) {
    if (this.outParameter && label) {
      try {
        console.log('assignValueToOutPutParameter');
        const result = tryParse(label);
        const value = (isBoolean(result)) ? result : (this.isDone(result)) ? result.done : result;
        this.outParameter.value = [new UserResponse({ label: this.outParameter.referencedId, value })];

      } catch (ex) {
        this.outParameter.value = [new UserResponse({ label, value: '?' })];
        // throw ex;
      }
    }
  }

  private compareMaps(map1: Map<string, Parameter>, map2: Map<string, Parameter>) {
    if (map1.size !== map2.size) {
      return false;
    }
    for (let [key, val] of map1) {
      if (!map2.has(key)) {
        return false;
      }
      const param2 = map2.get(key);
      if (!param2.equals(val)) {
        return false;
      }
    }
    return true;
  }

  private isDone = (value: { done: any } | any): value is { done: any } => {
    return (value) ? (value as { done: any }).done !== undefined : false;
  }

  public getParam(param: Parameter): string {
    return param.name + '🢨' + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') :
      (param.referencedId) ? '?' : '#ref?');
  }

}
