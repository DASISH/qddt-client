import { Directive, forwardRef, Attribute } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
  ]
})
export class EqualValidator implements Validator {
  constructor( @Attribute('validateEqual') public validateEqual: string,
               @Attribute('reverse') public reverse: string) {

  }

  private get isReverse() {
    return (this.reverse && this.reverse === 'true');
  }

  validate(c: AbstractControl): { [key: string]: any } {
    const v = c.value;
    const e = c.root.get(this.validateEqual);

    // value not equal
    if (e && v !== e.value && !this.isReverse) {
      return { validateEqual: false };
    }

    // value equal and reverse
    if (e && v === e.value && this.isReverse) {
      delete e.errors['validateEqual'];
      if (!Object.keys(e.errors).length) {
        e.setErrors(null);
      }
    }

    // value not equal and reverse
    if (e && v !== e.value && this.isReverse) {
      // e.valueChanges = true;
      e.setErrors({ validateEqual: false });
    }

    return null;
  }
}
