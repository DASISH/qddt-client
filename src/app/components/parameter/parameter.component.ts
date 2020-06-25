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

  public readonly isParamTrueRef = isParamTrue;

  constructor() { }

  ngOnInit(): void {
  }

  public getParam(param: Parameter, divider: string): string {
    return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
  }

}