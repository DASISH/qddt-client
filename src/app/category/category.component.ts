import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-category',
  moduleId: module.id,
  templateUrl: './category.component.html'
})
export class CategoryComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
