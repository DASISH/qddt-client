import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-user',

  templateUrl: './user.component.html'
})
export class UserComponent  {
  @ViewChild('detail', {static: false}) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
