import { Component, Optional, Inject, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ElementBase } from './element-base.class';
import { animations } from './animations';
import { delay } from '../../lib';

@Component({
  selector: 'qddt-input-number',
  template: `
    <div class="input-field" [id]="idOuter">
      <input
        id="{{identifier}}"
        class="validate"
        type="number"
        [(ngModel)]="value"
        [ngModelOptions]="{updateOn: 'blur'}"
        [ngClass]="{invalid: (invalid | async)}" />
      <label for="{{identifier}}">{{label}}</label>
      <qddt-validation [@flyInOut]="'in,out'" *ngIf="invalid | async" [messages]="failures | async"></qddt-validation>
    </div>
  `,
  animations,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FormInputNComponent, multi: true }],
})
export class FormInputNComponent extends ElementBase<number> implements AfterViewInit {
  @Input() public label: string;

  @ViewChild(NgModel, { static: true }) model: NgModel;

  public identifier = 'qddt-input-n-' + ident++;
  public idOuter = 'qddt-input-n-oi-' + ident;
  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
  ) {
    super(validators, asyncValidators);
  }

  ngAfterViewInit(): void {
    const element = document.getElementById(this.idOuter);
    if (element) {
      delay(20).then(() => {
        const max = element.parentElement.getAttribute('max');
        if (max) {
          element.firstElementChild.setAttribute('max', max);
        }
        const min = element.parentElement.getAttribute('min')
        if (min) {
          element.firstElementChild.setAttribute('min', min);
        }
        M.updateTextFields();
      });
    }
  }
}

let ident = 0;
