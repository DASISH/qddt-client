import {Component, EventEmitter, Output} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {CategoryService, Category, ResponseCardinality} from './category.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {CategoryEditComponent} from './edit/category_edit.component';
import {RevisionComponent} from '../revision/revision.component';
import {CategoryType} from './category_kind';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';

@Component({
  selector: 'category-scheme',
  moduleId: module.id,
  templateUrl: './category.scheme.component.html',
  pipes: [LocalDatePipe],
  providers: [CategoryService],
  directives: [AutocompleteComponent, MaterializeDirective, CommentListComponent, CategoryEditComponent, RevisionComponent]
})
export class CategorySchemeComponent {

  showCategoryForm: boolean = false;
  @Output() categorySelectedEvent: EventEmitter<any> = new EventEmitter();

  private categories: any;
  private templateCategories: any;
  private category: Category;
  private categoryEnums: any;
  private isTemplate: boolean;
  private selectedCategoryIndex: number;


  constructor(private categoryService: CategoryService) {
    this.category = new Category();
    this.categoryEnums =  CategoryType.group;
    this.isTemplate = true;
    this.selectedCategoryIndex = 0;
    this.categories = [];
    this.templateCategories = [];
  }

  ngOnInit() {
    this.categoryService.getAllByLevel('GROUP_ENTITY').subscribe(result => {
        this.templateCategories = result.content;
        this.categories = this.categories.concat(this.templateCategories);
    });
    this.categoryService.getAllByLevel('ENTITY').subscribe(result => {
        this.categories = this.categories.concat(result.content);
    });
  }

  onToggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
  }

  onSelectCategory(category: any) {
    this.categorySelectedEvent.emit(category);
  }

  setCategoryNumber(event:any) {
    if (this.category.inputLimit === undefined)
      this.category.inputLimit = new ResponseCardinality();
    this.category.inputLimit.maximum = event.target.value;
    if(this.category.children === undefined) {
      this.category.children = [];
    }
    this.category.children = this.category.children.slice(0, parseInt(this.category.inputLimit.maximum));
    for(let i = this.category.children.length; i < parseInt(this.category.inputLimit.maximum); i++) {
        this.category.children.push(new Category());
    }
  }

  select(candidate: any) {
    this.category.children[this.selectedCategoryIndex] = candidate;
  }

  onSave() {
    this.showCategoryForm = false;
    this.categoryService.save(this.category)
      .subscribe(result => {
        this.categories.push(result);
        this.templateCategories.push(result);
      });
    this.category  = new Category();
  }

}
