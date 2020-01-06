import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-author',

  templateUrl: './author.component.html'
})
export class AuthorComponent  {
  @ViewChild('detail', {static: true}) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
