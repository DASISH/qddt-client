import {
  Component,
  Optional,
  Inject,
  Input,
  ViewChild, AfterViewInit,
} from '@angular/core';

import {
  NgModel,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
} from '@angular/forms';
import { ElementBase } from './element-base.class';
import { animations } from './animations';

@Component({
  selector: 'qddt-textarea',
  template: `
    <div class="input-field" id="{{idOuter}}">
      <textarea
        id="{{identifier}}"
        class="materialize-textarea validate"
        placeholder="{{placeholder}}"
        [readonly]="readonly"
        [(ngModel)]="value"
        [ngClass]="{invalid: (invalid | async)}" >
      </textarea>
      <label *ngIf="label" for="{{identifier}}">{{label}}</label>
    </div>
  `,
  animations,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: FormTextAreaComponent,
    multi: true,
  }],
})
export class FormTextAreaComponent extends ElementBase<string> implements AfterViewInit {
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public readonly = false;

  @ViewChild(NgModel, { static: true }) model: NgModel;

  public identifier = 'qddt-textarea-' + ident++;
  public idOuter = 'qddt-ot-' + ident;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
  ) {
    super(validators, asyncValidators);
  }

  ngAfterViewInit(): void {
    const element = document.getElementById(this.idOuter);
    if ((element) && (element.parentElement.dataset.length)) {
      console.log('setting data length');
      element.firstElementChild.setAttribute('data-length', element.parentElement.dataset.length);
      M.CharacterCounter.init(element.children.item(0));
    }
    M.updateTextFields();
  }
}

let ident = 0;
