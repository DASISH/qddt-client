import { Component, Optional, Inject, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ElementBase} from './element-base.class';
import { animations } from './animations';
import { EnumItem, toEnumItems, EnumType } from '../../lib/enums/enum-item';
import { enumKeys, ElementEnumAware, StringIsNumber } from 'src/app/lib';


@Component({
  selector: 'qddt-select',
  template: `
  <div class="row input-field" *ngIf="lockups">
    <select id="{{identifier}}"  (change)="doChange($event.target.value)">
      <option *ngIf="placeholder" value="" disabled selected >{{placeholder}}</option>
      <option *ngFor="let item of lockups;" [selected]="isSelected(item)" [value]="item" >{{item}}</option>

<!--      <option *ngFor="let item of list" [value]="item" [ngClass]="{selected: isSelected(item)}" >{{item}}</option> -->
    </select>
    <label *ngIf="label" for="{{identifier}}">{{label}}</label>
  </div>
  `,
  animations,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FormSelectComponent, multi: true }],
})
@ElementEnumAware
export class FormSelectComponent extends ElementBase<any>  implements  AfterViewInit, OnChanges {
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public enum: any;
  // @Input() public enum: EnumType;
  // @Input() public keys: Map<any, string>;
  // @Input() public map: Map;

  @ViewChild(NgModel, { static: true }) model: NgModel;

  public identifier = `qddt-select-` + ident++;
  public lockups;

  constructor(
    @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
    @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
  ) {
    super(validators, asyncValidators);
  }

  ngOnChanges(changes: SimpleChanges): void {
  // this.lockups = enumKeys(this.enum).filter;
    // console.log(this.lockups || JSON);
    this.lockups = Object.keys( this.enum )
    .filter(StringIsNumber)
    .filter(f => f !== '0')
    .map(key => (this.enum[key] as string));
  }

  ngAfterViewInit(): void {
    M.FormSelect.init(document.getElementById(this.identifier));
  }

  public doChange(event) {
    this.value = this.enum[event];
    console.log(event, this.value);
  }

  public isSelected(value): boolean {
    if (this.value === this.enum[value]) {
      console.log(value);
      return true;
     }
    return false;
  }

}

let ident = 0;
