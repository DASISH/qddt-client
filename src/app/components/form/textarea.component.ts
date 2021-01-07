import {
  Component,
  Optional,
  Inject,
  Input,
  ViewChild, AfterViewInit, OnChanges, SimpleChanges,
} from '@angular/core';

import {
  NgModel,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';
import { ElementBase } from './element-base.class';
import { animations } from './animations';
import { delay } from '../../lib';

@Component({
  selector: 'qddt-textarea',
  template: `
    <div class="input-field" [id]="idOuter">
      <textarea
        [id]="identifier"
        class="materialize-textarea validate"
        [readonly]="readonly"
        [(ngModel)]="value"
        [ngClass]="{invalid: (invalid | async)}" >
      </textarea>
      <label [for]="identifier">{{label}}</label>
      <qddt-validation [@flyInOut]="'in,out'" *ngIf="invalid | async" [messages]="failures | async"></qddt-validation>
    </div>
  `,
  animations,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: FormTextAreaComponent,
    multi: true,
  }],
})
export class FormTextAreaComponent extends ElementBase<string> implements OnChanges, AfterViewInit {
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public readonly = false;

  @ViewChild(NgModel, { static: true }) model: NgModel;

  public identifier = 'qddt-textarea-' + ident++;
  public idOuter = 'qddt-ot-' + ident;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>) {
    super(validators, asyncValidators);

  }


  ngAfterViewInit(): void {
    delay(50).then(() => {
      const element = document.getElementById(this.idOuter);
      if (element) {
        const max = element.parentElement.getAttribute('maxlength') || element.parentElement.dataset.length;
        console.debug('TextArea View init');
        if (max) {
          element.firstElementChild.setAttribute('data-length', max);
          element.firstElementChild.setAttribute('maxlength', max);
          M.CharacterCounter.init(element.firstElementChild);
        }
        const min = element.parentElement.getAttribute('minlength')
        if (min) {
          element.firstElementChild.setAttribute('minlength', min);
        }
        console.debug('TextArea textareaAutoResize init');
        M.textareaAutoResize(document.getElementById(this.identifier));
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes) {
    }
  }

}

let ident = 0;
