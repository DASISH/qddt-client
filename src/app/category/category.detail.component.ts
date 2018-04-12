import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import { Category } from './category.classes';

@Component({
  selector: 'qddt-category-detail',
  moduleId: module.id,
  templateUrl: './category.detail.component.html',
})

export class CategoryDetailComponent  {
  @Input() category: Category;
  @Input() categories: Category[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent =  new EventEmitter<String>();
  public  revisionIsVisible: boolean;

  constructor(private categoryService: CategoryService) {
    this.revisionIsVisible = false;
  }

  onDeleteCategory() {
    this.categoryService.deleteCategory(this.category.id)
      .subscribe(() => {
          const i = this.categories.findIndex(q => q['id'] === this.category.id);
          if (i >= 0) {
            this.categories.splice(i, 1);
            this.hideDetail();
          }
        },
        (error: any) => console.log(error));
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }
}
