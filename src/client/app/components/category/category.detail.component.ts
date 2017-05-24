import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService, Category } from './category.service';
import { RationalComponent } from '../rational/rational.component';

@Component({
  selector: 'qddt-category-detail',
  moduleId: module.id,
  templateUrl: './category.detail.component.html',
  providers: [CategoryService],
})

export class CategoryDetailComponent implements OnInit {
  @Input() category: Category;
  @Input() categories: Category[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  private revisionIsVisible: boolean;

  constructor() {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
    if(this.category !== null && this.category !== undefined) {
      this.category['workinprogress'] = this.category['changeKind'] === 'IN_DEVELOPMENT';
    }
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }
}
