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

  private readonly delay = () => new Promise(resolve => setTimeout(resolve, 20));

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
  ) {
    super(validators, asyncValidators);
    this.registerOnSourceChanged(() => {
      const element = document.getElementById(this.idOuter);
      if (element) {

        this.delay().then(data => {
          M.updateTextFields();
        });
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
