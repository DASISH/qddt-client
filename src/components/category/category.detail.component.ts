import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {CategoryService, Category} from './category.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {CategoryEditComponent} from './edit/category_edit.component';
import {RevisionComponent} from '../revision/revision.component';

@Component({
  selector: 'qddt-category-detail',
  moduleId: module.id,
  templateUrl: './category.detail.component.html',
  pipes: [LocalDatePipe],
  providers: [CategoryService],
  directives: [ CommentListComponent, CategoryEditComponent, RevisionComponent]
})

export class CategoryDetailComponent {
  @Input() category: Category;
  @Input() categories: Category[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter();
  private revisionIsVisible: boolean;

  constructor() {
    this.revisionIsVisible = false;
  }

  hidDetail() {
    this.hideDetailEvent.emit('hide');
  }
}
