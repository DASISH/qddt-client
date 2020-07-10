import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from '@angular/forms';

import { MustMatch } from './must-match.validator';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mustMatch]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MustMatchDirective, multi: true }]
})
export class MustMatchDirective implements Validator {
  @Input('mustMatch') matchingControlNames: string[] = [];

  validate(formGroup: FormGroup): ValidationErrors {
    return MustMatch(this.matchingControlNames[0], this.matchingControlNames[1])(formGroup);
  }
}
