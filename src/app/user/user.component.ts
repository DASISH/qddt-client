import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-user',
  moduleId: module.id,
  templateUrl: './user.component.html'
})
export class UserComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
