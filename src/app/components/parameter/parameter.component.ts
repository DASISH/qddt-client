import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Parameter, isParamTrue, isMap, hasChanges } from 'src/app/lib';

@Component({
  selector: 'qddt-parameter',
  templateUrl: './parameter.component.html',
})
export class ParameterComponent implements OnChanges {
  @Input() inParameters: any; //Parameter[] | Map<string, Parameter>
  @Input() outParameters: Parameter[] | Map<string, Parameter>
  @Input() showParameters = false;

  public countIn = 0;
  public countOut = 0;
  public readonly isTrue = isParamTrue;
  public readonly isMapTrue = isMap;


  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.countIn = hasChanges(changes.inParameters) ?
      this.isMapTrue(changes.inParameters.currentValue) ?
        changes.inParameters.currentValue.size :
        changes.inParameters.currentValue.length :
      0;

    this.countOut = hasChanges(changes.outParameters) ?
      this.isMapTrue(changes.outParameters.currentValue) ?
        changes.outParameters.currentValue.size :
        changes.outParameters.currentValue.length :
      0;
  }

  public onClickIgnore(event: Event) {
    event.stopPropagation();
    // console.log('ignore click');
  }

  public getParam(param: Parameter, divider: string): string {
    try {
      const value = this.isMapTrue(this.outParameters) && (param.referencedId) ?
        this.outParameters.get(param.referencedId).value :
        param.value;

      return param.name + divider + ((value) ? value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
    } catch (ex) {
      // console.log(ex);
      return '?';
    }
  }


}
