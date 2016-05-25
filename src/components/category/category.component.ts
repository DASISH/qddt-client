import {Component, EventEmitter, Output} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {CategoryService, Category} from './category.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {CategoryEditComponent} from './edit/category_edit.component';
import {CategoryRevision} from './category_revision.component';
import {CategoryType} from './category_kind';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';

@Component({
  selector: 'category',
  moduleId: module.id,
  templateUrl: './category.component.html',
  pipes: [LocalDatePipe],
  providers: [CategoryService],
  directives: [AutocompleteComponent, MaterializeDirective, CommentListComponent, CategoryEditComponent, CategoryRevision]
})
export class CategoryComponent {

  showCategoryForm: boolean = false;
  @Output() categorySelectedEvent: EventEmitter<any> = new EventEmitter();

  private categories: any;
  private category: any;
  private categoryEnums: any;
  private isTemplate: boolean;
  private selectedCategoryIndex: number;
  private numberOfCategories: number;

  constructor(private categoryService: CategoryService) {
    this.category = new Category();
    this.categoryEnums =  CategoryType.element;
    this.isTemplate = false;
    this.selectedCategoryIndex = 0;
    this.numberOfCategories = 0;
    this.categories = [];
  }

  ngOnInit() {
    this.categoryService.getAll('%').subscribe(result => this.categories = result.content);
  }

  ngOnChanges() {
    this.categoryService.getAll('%')
      .subscribe(result => {
        this.categories = result;
      });
  }

  onToggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
  }

  onSelectCategory(category: any) {
    this.categorySelectedEvent.emit(category);
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

  setTemplate() {
    this.isTemplate = !this.isTemplate;
    if(this.isTemplate) {
      this.category.hierarchyLevel = 'GROUP_ENTITY';
      this.categoryEnums =  CategoryType.group;
    } else {
      this.category.hierarchyLevel = 'ENTITY';
      this.categoryEnums =  CategoryType.element;
    }
  }

  onSave() {
    this.showCategoryForm = false;
    this.categoryService.save(this.category)
      .subscribe(result => {
        this.categories.push(result);
      });
    this.category  = new Category();
  }

}
