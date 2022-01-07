import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Parameter, isParamTrue, isMap, getParameterKind, ParameterKind } from 'src/app/lib';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'qddt-parameter',
  templateUrl: './parameter.component.html',
})
export class ParameterComponent implements OnChanges {
  @Input() inParameters: any; //Parameter[] | Map<string, Parameter>
  @Input() outParameters: any; //Parameter[] | Map<string, Parameter>
  @Input() parameters = new Map<string, Parameter>();
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
    this.countOut = (this.outParameters) ? this.isMapTrue(this.outParameters) ?
      this.outParameters.size :
      this.outParameters.length : 0;
    this.countIn = (this.inParameters) ? this.isMapTrue(this.inParameters) ?
      this.inParameters.size :
      this.inParameters.length : 0;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inParameters?.currentValue) {
      this.countIn = (this.inParameters) ? this.isMapTrue(this.inParameters) ?
        this.inParameters.size :
        this.inParameters.length : 0;
    }
    if (changes.outParameters?.currentValue) {
      this.countOut = (this.outParameters) ? this.isMapTrue(this.outParameters) ?
        this.outParameters.size :
        this.outParameters.length : 0;

    }
    if (changes.parameters?.previousValue) {
      console.groupCollapsed('OnChanges');
      console.debug('... parameters');
      let prev = changes.parameters.previousValue as Map<string, Parameter>;
      this.parameters.forEach(
        (v, k) => {
          if (prev.has(k)) {
            if (!prev[k].equal(v)) {
              console.debug(prev[k]);
              console.debug(v);
            }
          } else {
            console.debug('NEW');
            console.debug(v);
          }
        });
      console.groupEnd();
    }
  }

  public onClickIgnore(event: Event) {
    event.stopPropagation();
  }

  public onChipClick(parameter: Parameter): void {
    const element = document.getElementById(parameter.referencedId || parameter.id);
    if (element) {
      // TODO JUMP and open....
      // element.focus();
      // element.click();
      // element.hidden = false;
    }
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  valid(drag: CdkDrag) {
    return true;
  }

  public onItemDrop(source: Parameter, target: Parameter) {
    target.referencedId = source.id;
  }

  public getParam(param: Parameter): string {
    try {

      param.value = (param.referencedId) ? this.parameters.get(param.referencedId).value : param.value;

      if (getParameterKind(param.parameterKind) === ParameterKind.OUT) {
        return param.name + this.out + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '[null]');
      } else {
        return param.name + this.in + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') :
          (param.referencedId) ? '[null]' : '[no-ref]');
      }

    } catch (ex) {
      console.error(ex.message);
      return '?';
    }
  }



  public sortBy(source: [], prop: string) {
    return source.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }
}
