import {Component, Optional, Inject, Input, ViewChild, AfterViewInit, AfterContentInit} from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ElementBase} from './element-base.class';
import { animations } from './animations';


@Component({
  selector: 'qddt-select',
  template: `
  <div class="input-field">
    <select id="{{identifier}}" [(ngModel)]="value" [ngClass]="{invalid: (invalid | async)}"  >
      <option value="" disabled selected *ngIf="placeholder">{{placeholder}}</option>
      <ng-content></ng-content>
    </select>
    <label *ngIf="label" for="{{identifier}}">{{label}}</label>
    <qddt-validation [@flyInOut]="'in,out'" *ngIf="invalid | async" [messages]="failures | async">
    </qddt-validation>
  </div>
  `,
  animations,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FormSelectComponent, multi: true }],
})
export class FormSelectComponent extends ElementBase<number>  implements  AfterViewInit {
  @Input() public label: string;
  @Input() public placeholder: string;

  @ViewChild(NgModel, { static: true }) model: NgModel;

  public identifier = `qddt-select-` + ident++;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
  ) {
    super(validators, asyncValidators);
  }

  ngAfterViewInit(): void {
    // console.log('ngAfterViewInit::SELECT');
    M.FormSelect.init(document.getElementById(this.identifier));
  }

}

let ident = 0;
