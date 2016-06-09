import {Component,  Input} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {CategoryService, Category,ResponseCardinality} from './category.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {CategoryType} from './category_kind';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';

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
        <category-hierarchy *ngFor="#child of children" [category]="child" ></category-hierarchy>
    </div>
    </div>
  </div>

  `,
  pipes: [LocalDatePipe],
  providers: [CategoryService],
  directives: [AutocompleteComponent, MaterializeDirective, CommentListComponent, CategoryType,ResponseCardinality]
})
export class CategoryHierarchyComponent {
  @Input() category: Category;
  private categoryEnums: any;

  constructor(private categoryService: CategoryService) {
    this.categoryEnums =  CategoryType.group + CategoryType.element;
  }

}
