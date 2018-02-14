import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService, Category } from './category.service';
import { CategoryType } from './category-kind';
@Component({
  selector: 'qddt-category-edit',
  moduleId: module.id,
  providers: [CategoryService, CategoryType],
  template: `
<div *ngIf="isVisible && category" id="{{category.id}}"  >
  <form (ngSubmit)="onSave()" #hf="ngForm">
    <div class="row">
      <div class="input-field col s12 ">
        <label for="label2" class="teal-text">Label</label>
        <input id="label2" name="label" type="text" class="validate" required
               [(ngModel)]="category.label" data-length="100" materialize="characterCounter">
      </div>
    </div>
    <div class="row">
      <div class="input-field col m12 ">
        <label for="name2" class="teal-text">Name</label>
        <input id="name2" name="name" type="text" class="validate" required [(ngModel)]="category.name"
               data-length="255" materialize="characterCounter">
      </div>
    </div>
    <div class="row">
      <div class="input-field col m12 ">
        <label [attr.for]="category.id + '-category-description'" class="teal-text">Description</label>
        <textarea class="materialize-textarea validate" name="{{category?.id}}-category-description"
                  data-length="1000" materialize="characterCounter" [(ngModel)]="category.description" >
        </textarea>
      </div>
    </div>
    <div class="row" *ngIf="category.categoryType!=='CATEGORY'">
      <div class="input-field col s2 ">
        <label for="ctype" class="teal-text">Type</label>
        <input id="ctype" name="ctype" type="text" class="validate" [(ngModel)]="category.categoryType" readonly>
      </div>
      <div class="input-field col s2 offset-m1">
        <label for="min" class="teal-text">Input limit minimum</label>
        <input id="min" name="mini" type="number" class="validate" readonly min="0" [(ngModel)]="category.inputLimit.minimum" >
      </div>
      <div class="input-field col s2 offset-m1">
        <label for="max" class="teal-text">Input limit maximum</label>
        <input id="max" name="maxi" type="number" class="validate" readonly min="1"  [(ngModel)]="category.inputLimit.maximum" >
      </div>
      <div class="input-field col s6 m8">
        <label for="format" class="teal-text">Format</label>
        <input id="format" name="format" type="text" class="validate" [(ngModel)]="category.format" >
      </div>
    </div>
    <div class="row">
      <qddt-rational [formName]="'RationalComp'" [element]="category" [config]="{hidden: [4]}"></qddt-rational>
    </div>
    <div class="row">
      <qddt-element-footer [element]="category" [type]="'category'"></qddt-element-footer>
    </div>
    <div *ngIf="isTemplate" class="row">
      <div class="col s2 input-field">
        <input id="{{category?.id}}-category_number" type="number"
          value="{{category.children.length}}"
          (input)="setCategoryNumber($event)" required>
        <label class="active teal-text"
          [attr.for]="category.id + '-category_number'">Number of Categories</label>
      </div>
       <div class="row"><table *ngIf="category.children">
         <thead><tr><td>Select Responses</td></tr></thead>
         <tbody>
           <tr *ngFor="let cat of category.children; let idx=index">
             <td><auto-complete
               [items]="categories"
               [elementtype]="QddtElementTypes[ElementKind.CATEGORY]"
               (autocompleteFocusEvent)="selectedCategoryIndex=idx;"
               [initialValue]="cat?.label"
               (autocompleteSelectEvent)="select($event)">
             </auto-complete></td>
            </tr>
          </tbody>
        </table></div>
    </div>
    <div class="row right-align">
      <button type="submit" class="btn btn-default" [disabled]="!hf.form.valid" >Submit</button>
    </div>
  </form>
</div>
`
})

export class CategoryEditComponent implements OnInit {

  @Input() category: Category;
  @Input() categories: Category[];
  @Input() isVisible: boolean;
  @Output() editDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  private categoryEnums: any;
  private isTemplate: boolean;
  private selectedCategoryIndex: number;
  private numberOfCategories: number;
  private savedObject: string;
  private savedCategoriesIndex: number;

  constructor(private categoryService: CategoryService) {
    this.categoryEnums =  CategoryType.element;
    this.selectedCategoryIndex = 0;
    this.numberOfCategories = 0;
  }

  ngOnInit() {
    if (!this.category) {
      this.category = new Category();
    }
    this.savedObject = JSON.stringify(this.category);
    if (!this.categories) {
      this.categories = [];
    }
    this.savedCategoriesIndex = this.categories
      .findIndex(q => q['id'] === this.category['id']);
    this.isTemplate = this.category['hierarchyLevel'] === 'GROUP_ENTITY';
    if (this.isTemplate) {
      this.categoryEnums = CategoryType.group;
    } else {
      this.categoryEnums =  CategoryType.element;
    }
  }

  setCategoryNumber(event: any) {
    this.numberOfCategories = event.target.value;
    if (this.category.children === undefined) {
      this.category.children = [];
    }
    this.category.children = this.category.children.slice(0, this.numberOfCategories);
    for (let i = this.category.children.length; i < this.numberOfCategories; i++) {
        this.category.children.push(new Category());
    }
  }

  select(candidate: any) {
    this.category.children[this.selectedCategoryIndex] = candidate;
  }

  onSave() {
    this.categoryService.edit(this.category)
      .subscribe((result: any) => {
          const i = this.categories.findIndex(q => q.id === result.id);
          if (i >= 0) {
            this.categories.splice(i, 1);
          }
          this.categories.push(result);
          // this.isVisible = false;
          this.editDetailEvent.emit('edit');
        },
        ( err ) => {
          throw err;
        });
  }

  onChangeType(kind: string) {
    this.category.categoryType = kind;
  }
}
