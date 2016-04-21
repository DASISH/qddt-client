import {Component, EventEmitter, Output} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {CategoryService, Category} from './category.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {CategoryEditComponent} from './edit/category_edit.component';
import {CategoryRevision} from './category_revision.component';

@Component({
  selector: 'category',
  moduleId: module.id,
  templateUrl: './category.component.html',
  pipes: [LocalDatePipe],
  providers: [CategoryService],
  directives: [ CommentListComponent, CategoryEditComponent, CategoryRevision]
})
export class CategoryComponent {

  showCategoryForm: boolean = false;
  @Output() categorySelectedEvent: EventEmitter<any> = new EventEmitter();

  private categories: any;
  private category: any;

  constructor(private categoryService: CategoryService) {
    this.category = new Category();
  }

  ngAfterViewInit() {
    this.categoryService.getAll().subscribe(result => this.categories = result.content);
  }

  ngOnChanges() {
    this.categoryService.getAll()
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

  onSave() {
    this.showCategoryForm = false;
    this.categoryService.save(this.category)
      .subscribe(result => {
        this.categories.push(result);
      });
    this.category  = new Category();
  }

}
