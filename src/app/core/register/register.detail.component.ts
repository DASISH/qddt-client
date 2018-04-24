import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-register-detail',
  moduleId: module.id,
  templateUrl: './register.detail.component.html',
})

export class RegisterDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified() {
    this.templateDetail.onHideDetail();
  }
}

