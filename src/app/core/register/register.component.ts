import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-register',
  moduleId: module.id,
  templateUrl: './register.component.html'
})
export class RegisterComponent  {
  @ViewChild('detail') templateDetail;


  public onFormModified() {
    this.templateDetail.onToggleForm();
  }
}
