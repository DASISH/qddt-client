import { Component,  Input } from '@angular/core';

import { CategoryService, Category } from './category.service';
import { CategoryType } from './category_kind';

@Component({
  selector: 'category-hierarchy',
  moduleId: module.id,
  template: `
  <div *ngIf="category">
    <div class="row">
      <div class="input-field col s4">      
        <label for="label" class="white-text">Label</label>
        {category.label}
      </div>
      <div class="input-field col s4">
        <label for="categoryType" class="white-text">Response type</label>
        {category.categoryType}
      </div>
    </div>
    <div class="row">
      <div class="input-field col s8">
        <label for="label" class="white-text">Label</label>
        {category.inputLimit.minimum} {category.inputLimit.maximum}
      </div>
     
      </div>        
    </div>
    <div *ngIf="children">
    <div class="row">    
        <category-hierarchy *ngFor="let child of children" [category]="child" ></category-hierarchy>
    </div>
    </div>
  </div>

  `,
  providers: [CategoryService],
})
export class CategoryHierarchyComponent {
  @Input() category: Category;
  private categoryEnums: any;

  constructor(private categoryService: CategoryService) {
    this.categoryEnums =  CategoryType.group + CategoryType.element;
  }

}
