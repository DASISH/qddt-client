import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { AlignmentKind, Category, ElementKind, enumKeys, IElement, ResponseCardinality } from 'src/app/lib';


@Component({
  selector: 'qddt-anchor-point',
  template: `
<form  [id]="'AP-'+formId"  [parentFormConnect]="formName" (change)="onChange()">
  <div class="col s3 input-field" tabindex="0">
    <input [id]="'CV-' + formId" name="value" type="number" [min]="inputLimit.minimum" [max]="inputLimit.maximum" [step]="inputLimit.stepUnit"
     [(ngModel)]="category.code.codeValue" required class="validate">
  </div>
  <!-- <div class="col s2 input-field" tabindex="1">
    <select id="PA-{{formId}}"  required class="validate" name="alignment"
        (change)="onSelectAlignment($event)">
        <option *ngFor="let item of alignments2;" [selected]="isSelected(item)" [value]="item" >{{item}}</option>
    </select>
  </div> -->
  <qddt-element-select  class="col s9 input-field" [source]="getSource(category)" [autoCreate]="true" [xmlLang]="category.xmlLang" (elementSelectedEvent)="onSelectCategory($event)">
  </qddt-element-select>
</form>
`
})

export class AnchorPointComponent implements AfterViewInit {
  @Input() category: Category;
  @Input() inputLimit: ResponseCardinality;
  @Input() formName: string;
  @Output() changeEvent = new EventEmitter<Category>();
  @Output() createEvent = new EventEmitter<Category>();

  public readonly formId = Math.round(Math.random() * 10000);
  public alignments2 = enumKeys(AlignmentKind);

  public getSource(category: Category): IElement {
    return { element: category, elementKind: ElementKind.CATEGORY };
  }

  ngAfterViewInit(): void {
    const instanse = document.getElementById('PA-' + this.formId);
    M.FormSelect.init(instanse);
  }

  public onSelectCategory(item: IElement) {
    const code = this.category.code;
    this.category = item.element;
    this.category.code = code;
    if (this.category.id === undefined) {
      this.createEvent.emit(this.category);
    } else {
      this.changeEvent.emit(this.category);
    }
  }

  public onSelectAlignment(event) {
    this.category.code.alignment = AlignmentKind[event.target.value];
    this.changeEvent.emit(this.category);
  }

  public onChange() {
    this.changeEvent.emit(this.category);
  }

  public isSelected(item): boolean {
    return (this.category.code.alignment === AlignmentKind[item]);
  }
}
