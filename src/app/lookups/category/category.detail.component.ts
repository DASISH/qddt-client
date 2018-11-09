import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-category-detail',

  templateUrl: './category.detail.component.html',
})

export class CategoryDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

