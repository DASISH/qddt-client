import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService, Category } from './category.service';

@Component({
  selector: 'qddt-category-detail',
  moduleId: module.id,
  templateUrl: './category.detail.component.html',
  providers: [CategoryService],
})

export class CategoryDetailComponent  {
  @Input() category: Category;
  @Input() categories: Category[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  private revisionIsVisible: boolean;

  constructor(private categoryService: CategoryService) {
    this.revisionIsVisible = false;
  }

  // ngOnInit() {
  //   if(this.category !== null && this.category !== undefined) {
  //     this.category['workinprogress'] = this.category['changeKind'] === 'IN_DEVELOPMENT';
  //   }
  // }

  onDeleteCategory() {
    this.categoryService.delete(this.category.id)
      .subscribe((result: any) => {
          let i = this.categories.findIndex(q => q['id'] === this.category.id);
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
