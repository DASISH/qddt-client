import { Component, Optional, Inject, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ElementBase } from './element-base.class';
import { animations } from './animations';

@Component({
  selector: 'qddt-input',
  template: `
    <div class="input-field" [id]="idOuter">
      <input
        [id]="identifier"
        class="validate"
        required
        [readonly]="readonly"
        type="{{inputType}}"
        [(ngModel)]="value"
        [ngClass]="{invalid: (invalid | async)}" />
      <label >{{label}}</label>
    </div>
  `,
  animations,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FormInputComponent, multi: true }],
  styles: ['.character-counter { color: rbg(0,255,0); }'],
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
    this.registerOnSourceChanged(() => {
      const element = document.getElementById(this.idOuter);
      if (element) {
        console.log('M.updateTextFields');
        // M.updateTextFields();
        // M.AutoInit(element);      // const element = document.getElementById(this.identifier) as HTMLSelectElement;
      }
    });
  }

  ngAfterViewInit(): void {
    const element = document.getElementById(this.idOuter);
    if ((element) && (element.parentElement.dataset.length)) {
      element.firstElementChild.setAttribute('data-length', element.parentElement.dataset.length);
      M.CharacterCounter.init(element.children.item(0));
    }
  }
}

let ident = 0;
