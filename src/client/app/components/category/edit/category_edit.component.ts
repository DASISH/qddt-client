import { Component, Input, OnInit } from '@angular/core';

import { CategoryService, Category } from '../category.service';
import { Change } from '../../../common/change_status';
import { CategoryType } from '../category_kind';
@Component({
  selector: 'category-edit',
  moduleId: module.id,
  providers: [CategoryService,CategoryType],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="category" class="card" id="{{category.id}}"  >
      <form (ngSubmit)="onSave()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <textarea id="{{category?.id}}-label" class="materialize-textarea"
              name="{{category?.id}}-label"
              [(ngModel)]="category.label" [attr.maxlength]="255"
              required (ngModelChange)="category.name = category.label.toUpperCase()">
            </textarea>
            <label [attr.for]="category.id + '-label'" class="active teal-text">Label</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea"
              name="{{category?.id}}-category.description" [(ngModel)]="category.description" ></textarea>
            <label for="description" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
          <qddt-rational [element]="category"></qddt-rational>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
            <div class="chip" *ngFor="let author of category.authors" >
              <img src="{{author.picture}}">{{author.name}} <i class="material-icons">close</i>
            </div>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{category.modifiedBy.agency.name}}</div>
          </div>
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
                 <td><autocomplete [items]="categories"
                       [searchField]="'label'"
                       (autocompleteFocusEvent)="selectedCategoryIndex=idx;"
                       [initialValue]="cat?.label"
                       (autocompleteSelectEvent)="select($event)"></autocomplete></td>
                </tr>
              </tbody>
            </table></div>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>
`
})

export class CategoryEditComponent implements OnInit {

  @Input() category: Category;
  @Input() categories: any;
  @Input() isVisible: boolean;
  private categoryEnums:any;
  private changeEnums: any;
  private isTemplate: boolean;
  private selectedCategoryIndex: number;
  private numberOfCategories: number;

  constructor(private categoryService: CategoryService) {
    this.changeEnums = Change.status;
    this.categoryEnums =  CategoryType.element;
    this.selectedCategoryIndex = 0;
    this.numberOfCategories = 0;
  }

  ngOnInit() {
    this.isTemplate = this.category['hierarchyLevel'] === 'GROUP_ENTITY';
    if(this.isTemplate) {
      this.categoryEnums = CategoryType.group;
    } else {
      this.categoryEnums =  CategoryType.element;
    }
  }

  setCategoryNumber(event:any) {
    this.numberOfCategories = event.target.value;
    if(this.category.children === undefined) {
      this.category.children = [];
    }
    this.category.children = this.category.children.slice(0, this.numberOfCategories);
    for(let i = this.category.children.length; i < this.numberOfCategories; i++) {
        this.category.children.push(new Category());
    }
  }

  select(candidate: any) {
    this.category.children[this.selectedCategoryIndex] = candidate;
  }

  onSave() {
    this.categoryService.edit(this.category)
      .subscribe((result: any) => {
        this.category = result;
        this.isVisible = false;
      });
  }

}
