import {
  AbstractControl,
  AsyncValidatorFn,
  Validator,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { of } from 'rxjs';


export interface ValidationResult { [validator: string]: string | boolean | any; }

export type AsyncValidatorArray = Array<Validator | AsyncValidatorFn>;

export type ValidatorArray = Array<Validator | ValidatorFn>;

const normalizeValidator =
  (validator: Validator | ValidatorFn): ValidatorFn | AsyncValidatorFn => {
    const func = (validator as Validator).validate.bind(validator);
    if (typeof func === 'function') {
      return (c: AbstractControl) => func(c);
    } else {
      return validator as ValidatorFn | AsyncValidatorFn;
    }
  };

export const composeValidators =
  (validators: ValidatorArray): AsyncValidatorFn | ValidatorFn => {
    if (validators == null || validators.length === 0) {
      return null;
    }
    return Validators.compose(validators.map(normalizeValidator));
  };

export const validate = (validators: ValidatorArray, asyncValidators: AsyncValidatorArray) => {
  return (control: AbstractControl) => {
    if (control.pristine && control.untouched) {
      return of(null);
    }
    const synchronousValid = () => composeValidators(validators)(control);

    if (asyncValidators) {
      const asyncValidator = composeValidators(asyncValidators);

      return asyncValidator(control).map(v => {
        const secondary = synchronousValid();
        if (secondary || v) { // compose async and sync validator results
          return Object.assign({}, secondary, v);
        }
      });
    }

    if (validators) {
      return of(synchronousValid());
    }

    return of(null);
  };
};

export const message = (validator: ValidationResult, key: string): string => {
  switch (key) {
    case 'required':
      return 'This field is required';
    case 'pattern':
      return 'Value does not match required pattern';
    case 'minlength':
      return 'minium length required [' + validator[key].requiredLength + ']';
    case 'maxlength':
      return 'Your response excide maximum length allowed';
  }

  switch (typeof validator[key]) {
    case 'string':
      return validator[key] as string;
    default:
      return `Validation failed: ${key}`;
  }
};

