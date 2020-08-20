import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Parameter, isParamTrue, isMap, hasChanges } from 'src/app/lib';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'qddt-parameter',
  templateUrl: './parameter.component.html',
})
export class ParameterComponent implements OnChanges {
  @Input() inParameters: any; //Parameter[] | Map<string, Parameter>
  @Input() outParameters: any; //Parameter[] | Map<string, Parameter>
  @Input() showParameters = false;

  public countIn = 0;
  public countOut = 0;
  public readonly isTrue = isParamTrue;
  public readonly isMapTrue = isMap;

  private readonly in = '🢨';
  private readonly out = '🢩';

  public readonly valueAscOrder = (a: KeyValue<string, Parameter>, b: KeyValue<string, Parameter>): number => {
    return a.value.idx - b.value.idx;
  }


  constructor() { }


  public refresh() {
    this.countIn = this.isMapTrue(this.inParameters) ?
      this.inParameters.size :
      this.inParameters.length;

    this.countOut = this.isMapTrue(this.outParameters) ?
      this.outParameters.size :
      this.outParameters.length;

  }

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
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  valid(drag: CdkDrag) {
    return true;
  }

  public onItemDrop(source: Parameter, target: Parameter) {
    target.referencedId = source.id;
  }

  public getParam(param: Parameter, divider: string): string {
    try {
      const value = this.isMapTrue<string, Parameter>(this.outParameters) ?
        (param.referencedId) ? this.outParameters.get(param.referencedId).value : param.value :
        (param.referencedId) ? this.outParameters.find(f => f.id === param.referencedId).value : param.value;

      if (param.parameterKind === 'OUT') {
        return param.name + this.out + ((value) ? value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
      } else {


        return param.name + this.in + ((value) ? value.map(p => '[' + p.value + ':' + p.label + ']').join(',') :
          (param.referencedId) ? '?' : '#ref?');
      }

    } catch (ex) {
      console.log('getparm feil');
      return '?';
    }
  }

  public sortBy(source: [], prop: string) {
    return source.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }
}
