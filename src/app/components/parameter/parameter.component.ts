import { Component, OnInit, Input } from '@angular/core';
import { Parameter, isParamTrue } from 'src/app/lib';

@Component({
  selector: 'qddt-parameter',
  templateUrl: './parameter.component.html',
  styleUrls: ['./parameter.component.css']
})
export class ParameterComponent implements OnInit {
  @Input() inParameters: Parameter[];
  @Input() outParameters: Parameter[];
  @Input() showParameters = false;
  public readonly isTrue = isParamTrue;

  constructor() { }

  ngOnInit(): void {
  }
  public onClickIgnore(event: Event) {
    event.stopPropagation();
    console.log('ignore click');
  }

  public getParam(param: Parameter, divider: string): string {
    try {
      return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
    } catch (ex) {
      // console.log(ex);
      return '?';
    }
  }


}
