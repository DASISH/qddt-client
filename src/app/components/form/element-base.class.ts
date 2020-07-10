import { NgModel } from '@angular/forms';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ValueAccessorBase } from './value-accessor.class';
import { AsyncValidatorArray, message, validate, ValidationResult, ValidatorArray } from './validate.function';


export abstract class ElementBase<T> extends ValueAccessorBase<T> {
  protected abstract model: NgModel;

  constructor(private validators: ValidatorArray, private asyncValidators: AsyncValidatorArray) {
    super();
  }

  protected validate(): Observable<ValidationResult> {
    return validate(this.validators, this.asyncValidators)(this.model.control);
  }

  public get invalid(): Observable<boolean> {
    return this.validate().pipe(
      map(v => Object.keys(v || {}).length > 0));
  }

  public get failures(): Observable<Array<string>> {
    return this.validate().pipe(
      map(v => Object.keys(v).map(k => message(v, k))));
  }
}
