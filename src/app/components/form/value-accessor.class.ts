import { ControlValueAccessor } from '@angular/forms';

export abstract class ValueAccessorBase<T> implements ControlValueAccessor {
  private innerValue: T;

  private changed = new Array<(value: T) => void>();
  private touched = new Array<() => void>();
  private sourceChanged = new Array<() => void>();

  get value(): T {
    return this.innerValue;
  }

  set value(value: T) {
    if (this.innerValue !== value) {
      this.innerValue = value;
      this.changed.forEach(f => f(value));
    }
  }

  writeValue(value: T) {
    this.innerValue = value;
    if (value) {
      this.sourceChanged.forEach(f => f());
    }
  }

  registerOnChange(fn: (value: T) => void) {
    this.changed.push(fn);
  }

  registerOnSourceChanged(fn: () => void) {
    this.sourceChanged.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this.touched.push(fn);
  }

  touch() {
    this.touched.forEach(f => f());
  }
}
