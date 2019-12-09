import {
  Component,
  Optional,
  Inject,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  AfterContentInit,
  AfterContentChecked, AfterViewChecked
} from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ElementBase} from './element-base.class';
import { animations } from './animations';



@Component({
  selector: 'qddt-select',
  template: `
  <div class="row input-field">
    <select id="{{identifier}}" [(ngModel)]="value" >
      <option *ngIf="placeholder" value="" disabled >{{placeholder}}</option>
      <option *ngFor="let item of lockups" [value]="item[0]" >{{item[1]}}</option>
    </select>
    <label *ngIf="label" for="{{identifier}}">{{label}}</label>
  </div>
  `,
  animations,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FormSelectComponent, multi: true }],
})

export class FormSelectComponent extends ElementBase<string>  implements  AfterViewInit,  OnChanges, AfterViewChecked {
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public lockups: [string, string][];

  @ViewChild(NgModel, { static: false }) model: NgModel;

  public identifier = `qddt-select-` + ident++;
  public  showLockups = false;
  private init = false;

  constructor(@Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
              @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
  ) {
    super(validators, asyncValidators);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lockups.currentValue) {
      this.showLockups = true;
    }

    if (!changes.lockups.isFirstChange()) {
      const element = document.getElementById(this.identifier) as HTMLSelectElement;
      while ( element.options.length > 0) {
        element.options.remove(0);
      }
      if (this.placeholder) {
        element.options.add(new Option(this.placeholder, '', true));
      }
      this.lockups.forEach(c => {
        element.options.add(new Option(c[1], c[0], false));
      });
      element.options.selectedIndex = this.lockups.findIndex( item => item[0] === this.value);
      M.FormSelect.init(element);
      console.log('not frist change ' + this.value);
    }
  }

  ngAfterViewInit(): void {
    const element = document.getElementById(this.identifier) as HTMLSelectElement;
    M.FormSelect.init(element);
    // this.touch();
  }

  ngAfterViewChecked(): void {
    if ((this.value) && !this.init) {
      const element = document.getElementById(this.identifier) as HTMLSelectElement;
      element.options.selectedIndex = this.lockups.findIndex( item => item[0] === this.value);
      this.init = true;
      M.FormSelect.init(element);
      console.log(this.value + ' <-> ' +  element.options.selectedIndex);
    } else {
      console.log('not intit ' + this.label);
    }
  }

  // public isSelected(key): boolean {
  //   // console.log(key + ' - ' + (this.value === key) );
  //   return (this.value === key);
  // }

  // ngAfterContentInit(): void {
  //   console.log( this.value);
  //   const element = document.getElementById(this.identifier) as HTMLSelectElement;
  //   element.options.selectedIndex = this.lockups.findIndex( item => item[0] === this.value);
  // }

}

let ident = 0;
