import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CategoryService, Category } from './category.service';

@Component({
  selector: 'qddt-category-detail',
  moduleId: module.id,
  templateUrl: './category.detail.component.html',
  providers: [CategoryService],
})

export class CategoryDetailComponent {
  @Input() category: Category;
  @Input() categories: Category[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  private revisionIsVisible: boolean;

  constructor() {
    this.revisionIsVisible = false;
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }
}
