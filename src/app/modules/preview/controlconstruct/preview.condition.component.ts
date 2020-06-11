import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ConditionConstruct, Parameter } from '../../../lib';

@Component({
  selector: 'qddt-preview-conditionconstruct',

  template: `
    <ul  *ngIf="condition">
      <ng-container class="row" *ngIf="condition?.outParameter?.length>0 || condition?.inParameter?.length>0">
        <li class="collection-item">
          <label>Parameters</label>
        </li>
        <li class="collection-item chip" title="In parameter" *ngFor="let parameter of condition.inParameter">{{getParam(parameter,'🢩')}} </li>
        <li class="collection-item chip" title="Out parameter" *ngFor="let parameter of condition.outParameter">{{getParam(parameter, '🢨')}} </li>
      </ng-container>
      <li class="collection-item">
        <label>Name</label>
        <p>{{condition.name }}</p>
      </li>
      <li class="collection-item">
        <label>ConditionKind</label>
        <span>{{condition.conditionKind }}</span>
      </li>
      <li class="collection-item card-panel">
        <label>Condition</label>
        <code [innerHtml]="condition.condition"> </code>
      </li>
  </ul>
  `,
  styles: [
  ],
  providers: [],
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
          text = text.replace(new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + p.value.map(pp => pp.label).join(',') + '</mark>');
          console.log('replaced');
        }
      });
    }
    return text;

  }


}
