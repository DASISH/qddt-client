import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConditionConstruct, Parameter, ConditionKind, IfThenElse, Loop, RepeatUntil, RepeatWhile, ConRef, UserResponse } from '../../../lib';

@Component({
  selector: 'qddt-preview-conditionconstruct',
  template: `
    <ul *ngIf="condition">
      <ng-container class="row" *ngIf="condition?.outParameter?.length>0 || condition?.inParameter?.length>0">
        <li class="collection-item">
          <label>Parameters</label>
        </li>
        <div class="chip" title="In parameter" *ngFor="let parameter of condition.inParameter">{{getParam(parameter,'🢩')}} </div>
        <div class="chip" title="Out parameter" *ngFor="let parameter of condition.outParameter">{{getParam(parameter, '🢨')}} </div>
      </ng-container>
      <li class="collection-item card-panel">
        <p><label>Condition</label></p>
        <code [innerHtml]="insertParam(condition.condition)"> </code>
        <p><label>Ref</label></p>
        <p>{{condition?.condition?.ref.toString()}}</p>

      </li>
  </ul>
  `,
})

export class PreviewConditionConstructComponent implements OnChanges {
  @Input() condition: ConditionConstruct;
  @Input() inParameters: Parameter[];
  @Input() showDetail = true;
  elementId: string = new Date().toString();


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.condition && changes.condition.isFirstChange()) {
      this.condition = new ConditionConstruct(this.condition);
    }
    if (changes.inParameters && changes.inParameters.currentValue && this.condition) {
      this.condition.inParameter =
        this.condition.inParameter.map(obj => this.inParameters.find(o => o.name === obj.name)
          || obj);
      const idx = this.inParameters.findIndex(p => p.name === this.condition.name);
      if (idx >= 0) {
        this.condition.inParameter
          .filter(f => f.name.startsWith('INPUT'))
          .forEach((para, index) => {
            para.value = this.inParameters[idx - (index + 1)].value;
          });
      }
    }

  }

  public getParam(param: Parameter, divider: string): string {
    if (this.inParameters) {
      this.condition.inParameter =
        this.condition.inParameter.map(obj => this.inParameters.find(o => o.name === obj.name) || obj);

    }
    return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
  }

  public insertParam(conref: ConRef | string): string {
    let text = this.isConRef(conref) ? (conref as ConRef).condition.content : conref;
    let label = text;

    if (this.condition && this.condition.inParameter) {
      this.condition.inParameter.forEach(p => {
        if (p.value) {
          label = label.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), p.value[0].value.toString());
          text = text.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => pp.label || p.name).join(',') + '</mark>');
        }
      });
      if (this.condition.outParameter && this.condition.outParameter.length === 1 && label) {
        try {
          this.condition.outParameter[0].value = [new UserResponse({ label, value: eval(label) })];
        } catch (Ex) {
          this.condition.outParameter[0].value = [new UserResponse({ label, value: '?' })];
        }
      }
    }
    return text + ' = ' + this.condition.outParameter[0].value[0].value || '?' +
      '\nRef: ' + (conref as ConRef).ref;
  }

  public isConRef(element: any | ConRef): element is ConRef {
    return (element as ConRef).condition !== undefined;
  }

}
