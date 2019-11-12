import {Component, Input} from '@angular/core';
import { NG_VALUE_ACCESSOR, } from '@angular/forms';


@Component({
  selector: 'qddt-input',
  template: `
<div>
  <input type="text" [(ngModel)]="value" />
</div>
  `,
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: FormInputComponent, multi: true}
  ],
})
export class FormInputComponent {}
