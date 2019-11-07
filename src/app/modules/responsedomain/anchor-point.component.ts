import {AfterViewInit, Component, Input} from '@angular/core';
import {Category, ResponseCardinality} from '../../lib/classes';
import {AligmentKind} from '../../lib/enums';
import {enumKeys, EnumToArray} from '../../lib/consts';

@Component({
  selector: 'qddt-achor-point',
  template: `
<form  id="AP-{{formId}}"  [parentFormConnect]="formName">
  <div class="col s2 input-field" tabindex="0">
    <input id="CODE-VALUE-{{formId}}" name="value" type="number" min="{{inputLimit.minimum}}" max="{{inputLimit.maximum}}"
     [(ngModel)]="category.code.codeValue" required class="validate">
  </div>
  <div class="col s2 input-field" tabindex="1">
    <select id="PA-{{formId}}" (change)="onSelectAligment(item)" required class="validate">
        <option *ngFor="let item of aligments2;" [selected]="isSelected(item)" [value]="item">{{item}}</option>
    </select>
  </div>
  <div class="col s6">{{category.label}} {{aligments2 || JSON}}
<!--    <qddt-auto-complete-->
<!--      [items]="categories"-->
<!--      [initialValue]="category?.label"-->
<!--      [elementKind]="CATEGORY"-->
<!--      (focusEvent)="selectedCategoryIndex=idx;"-->
<!--      (selectEvent)="onSelectCategory($event)"-->
<!--      (enterEvent)="onSearchCategories($event)">-->
<!--    </qddt-auto-complete>-->
  </div>
</form>
`
})

export class AnchorPointComponent implements AfterViewInit {
  @Input() category: Category;
  @Input() inputLimit: ResponseCardinality;
  @Input() formName: string;

  public readonly formId = Math.round( Math.random() * 10000);
  public aligments2 = enumKeys(AligmentKind);

  ngAfterViewInit(): void {
    M.FormSelect.init(document.getElementById('PA-' + this.formId));
  }

  public onSelectAligment(item) {
    this.category.code.alignment = AligmentKind[item];
    console.log(this.category.code.alignment + ' ' + item);
  }

  public isSelected(item): boolean {
    return (this.category.code.alignment === AligmentKind[item]);
  }
}
