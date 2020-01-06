import {
  Component,
  Optional,
  Inject,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { NgModel, NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { ElementBase} from './element-base.class';
import { animations } from './animations';
import { ISelectOption } from 'src/app/lib';



@Component({
  selector: 'qddt-select',
  template: `
    <div class="input-field" *ngIf="hasChildren();  else ITEM">
      <select  id="{{identifier}}" [(ngModel)]="value" [ngModelOptions]="{updateOn: 'blur'}">
        <option *ngIf="placeholder" value="" disabled >{{placeholder}}</option>
        <optgroup *ngFor="let item of lockups" label="{{item.label}}">
            <option *ngFor="let child of item.children" [value]="child.value" >{{child.label}}</option>
        </optgroup>
      </select>
      <label *ngIf="label">{{label}}</label>
    </div>
    <ng-template #ITEM>
      <div class="input-field">
        <select  id="{{identifier}}" [(ngModel)]="value" >
          <option *ngIf="placeholder" value="" disabled >{{placeholder}}</option>
          <option *ngFor="let item of lockups" [value]="item.value">{{item.label}}</option>
        </select>
        <label *ngIf="label">{{label}}</label>
      </div>
    </ng-template>
  `,
  animations,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: FormSelectComponent, multi: true }],
})

export class FormSelectComponent extends ElementBase<string>  implements  AfterViewInit,  OnChanges {
  @Input() public lockups: ISelectOption[];
  @Input() public label: string;
  @Input() public placeholder: string;

  @ViewChild(NgModel, { static: false }) model: NgModel;

  public identifier = `qddt-select-` + ident++;

  constructor(@Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
              @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
  ) {
    super(validators, asyncValidators);
    this.registerOnWritten( () => {
      const element = document.getElementById(this.identifier) as HTMLSelectElement;
      if (element) {
        this.setindex(element);
        M.FormSelect.init(element);
      }
    });
    this.registerOnChange( value => console.log(value || JSON));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lockups.isFirstChange() === false) {
      this.buildOptions();
    }
  }

  ngAfterViewInit(): void {
    const element = document.getElementById(this.identifier) as HTMLSelectElement;
    M.FormSelect.init(element);
  }

  public hasChildren(): boolean {
    return (this.lockups) && this.lockups.findIndex( item => ((item.children) && (item.children.length > 0)) ) >= 0 ;
  }

  private buildOptions() {
    const element = document.getElementById(this.identifier) as HTMLSelectElement;
    while ( element.options.length > 0) {
      element.options.remove(0);
    }
    if (this.placeholder) {
      element.options.add(new Option(this.placeholder, '', true));
    }
    this.lockups.forEach(item => {
      if (item.children && item.children.length > 0) {
        element.options.add(this.populateOptGroup(item));
      } else {
        element.options.add(new Option(item.label, item.value, false));
      }
    });
    this.setindex(element);
    M.FormSelect.init(element);

  }

  private populateOptGroup(item: ISelectOption ): HTMLOptGroupElement {
    const optGrp = new HTMLOptGroupElement();
    optGrp.label = item.label;
    item.children.forEach( child =>  optGrp.append(new Option(child.label, child.value, false)));
    return optGrp;
  }

  private setindex(element: HTMLSelectElement) {
    if ((element.options) && (element.options.length > 0) && (this.value)) {
      let i = -1;
      let isFound = false;
      do {
        isFound =  (element.options.item(++i).value == this.value);
      }
      while (isFound === false ||  (element.options.length === i - 1) );
      if (isFound ) {
        element.options.selectedIndex = i;
      }
    }
  }


}

let ident = 0;
