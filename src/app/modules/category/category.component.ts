import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-category',

  templateUrl: './category.component.html'
})
export class CategoryComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
