import { Component, Optional, Inject, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ElementBase } from './element-base.class';
import { animations } from './animations';
import { delay } from '../../lib';

@Component({
  selector: 'qddt-input',
  template: `
<div class="input-field" [id]="idOuter">
  <input
    [id]="identifier"
    class="validate"
    [readonly]="readonly"
    type="{{inputType}}"
    [(ngModel)]="value"
    [ngClass]="{invalid: (invalid | async)}"/>
  <label [for]="identifier">{{label}}</label>
  <qddt-validation [@flyInOut]="'in,out'" *ngIf="invalid | async" [messages]="failures | async"></qddt-validation>
</div>
  `,
  animations,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FormInputComponent, multi: true }],
  styles: ['.character-counter { color: black; }'],
})
export class FormInputComponent extends ElementBase<string> implements AfterViewInit {
  @Input() public label: string;
  @Input() public placeholder = '';
  @Input() public inputType = 'text';
  @Input() public readonly = false;
  @ViewChild(NgModel, { static: true }) model: NgModel;

  public identifier = 'qddt-input-' + ident++;
  public idOuter = 'qddt-oi-' + ident;


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
        const max = element.parentElement.getAttribute('maxlength') || element.parentElement.dataset.length;
        if (max) {
          element.firstElementChild.setAttribute('data-length', max);
          element.firstElementChild.setAttribute('maxlength', max);
          M.CharacterCounter.init(element.firstElementChild);
        }
        const min = element.parentElement.getAttribute('minlength')
        if (min) {
          element.firstElementChild.setAttribute('minlength', min);
        }
        M.updateTextFields();
      });
    }
  }
}

let ident = 0;
