import { AfterViewInit, Component, Input } from '@angular/core';
import { AlignmentKind, Category, ResponseCardinality, enumKeys } from 'src/app/lib';


@Component({
  selector: 'qddt-anchor-point',
  template: `
<form  id="AP-{{formId}}"  [parentFormConnect]="formName">
  <div class="col s2 input-field" tabindex="0">
    <input id="CODE-VALUE-{{formId}}" name="value" type="number" min="{{inputLimit.minimum}}" max="{{inputLimit.maximum}}"
     [(ngModel)]="category.code.codeValue" required class="validate">
  </div>
  <div class="col s2 input-field" tabindex="1">
    <select id="PA-{{formId}}" name="alignment" [(ngModel)]="category.code.alignment" (ngModelChange)="onSelectAligment($event)" required class="validate" >
        <option *ngFor="let item of aligments2;" [selected]="isSelected(item)" [value]="item">{{item}}</option>
    </select>
  </div>
  <div class="col s6">{{category.label}} {{alignments2 || JSON}}
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

  public readonly formId = Math.round(Math.random() * 10000);
  public alignments2 = enumKeys(AlignmentKind);

  constructor() {
      // this.aligments2
  }

  ngAfterViewInit(): void {
    M.FormSelect.init(document.getElementById('PA-' + this.formId));
  }

  public onSelectAligment(item) {
    this.category.code.alignment = AligmentKind[item];
    // console.log(this.category.code.alignment + ' ' + item);
  }

  public isSelected(item): boolean {
    console.log(this.category.code.alignment + ' ' + item + ' ' + AligmentKind[item]);
    return (this.category.code.alignment === AligmentKind[item]);
  }
}
