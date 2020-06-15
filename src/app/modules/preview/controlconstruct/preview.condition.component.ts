import { UserResponse } from './../../../lib/classes/responsedomain.classes';
import { Condition } from './../../../lib/classes/controlconstruct.classes';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConditionConstruct, Parameter, ConditionKind, IfThenElse, Loop, RepeatUntil, RepeatWhile } from '../../../lib';

@Component({
  selector: 'qddt-preview-conditionconstruct',
  template: `
    <ul *ngIf="condition">
      <ng-container class="row" *ngIf="condition?.outParameter?.length>0 || condition?.inParameter?.length>0">
        <li class="collection-item">
          <label>Parameters</label>
        </li>
        <li class="collection-item chip" title="In parameter" *ngFor="let parameter of condition.inParameter">{{getParam(parameter,'🢩')}} </li>
        <li class="collection-item chip" title="Out parameter" *ngFor="let parameter of condition.outParameter">{{getParam(parameter, '🢨')}} </li>
      </ng-container>
      <li class="collection-item card-panel">
        <label>Condition</label>
        <code [innerHtml]="insertParam(condition.condition)"> </code>
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
    if (changes.condition) {
      this.condition = new ConditionConstruct(this.condition);
    }
    // if (changes.inParameters) {
    //   console.log('changes in params');
    //   if (this.condition && this.condition.condition) {
    //     switch (ConditionKind[this.condition.conditionKind]) {
    //       case ConditionKind.ComputationItem:
    //         break;
    //       case ConditionKind.IfThenElse:
    //         const ifthenelse = this.condition.condition as IfThenElse;
    //         this.setOutParam(ifthenelse.ifCondition);
    //         break;
    //       case ConditionKind.ForEach:
    //         const loop = this.condition.condition as Loop;
    //         this.setOutParam(loop.loopWhile);
    //         break;
    //       case ConditionKind.ForI:
    //         const fori = this.condition.condition as Loop;
    //         this.setOutParam(fori.loopWhile);
    //         break;
    //       case ConditionKind.RepeatUntil:
    //         const repeat = this.condition.condition as RepeatUntil;
    //         this.setOutParam(repeat.untilCondition)
    //         break;
    //       case ConditionKind.RepeatWhile:
    //         const repeatwhile = this.condition.condition as RepeatWhile;
    //         this.setOutParam(repeatwhile.whileCondition)
    //         break;
    //     }
    //   }
    // }
  }

  public getParam(param: Parameter, divider: string): string {
    if (this.inParameters) {
      this.condition.inParameter =
        this.condition.inParameter.map(obj => this.inParameters.find(o => o.name === obj.name) || obj);

    }
    return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
  }

  public insertParam(text: string): string {
    if (this.condition && this.condition.inParameter) {
      this.condition.inParameter.forEach(p => {
        if (p.value) {
          // let label = text.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), p.value.map(pp => pp.value).join(','));
          // let label = text.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), p.value[0].value.toString())
          text = text.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => pp.label).join(',') + '</mark>');
          // if (this.condition.outParameter && this.condition.outParameter.length === 1) {
          //   this.condition.outParameter[0].value = [new UserResponse({ label, value: eval(label) })]
          // }
        }
      });
    }
    return text;
  }

}
