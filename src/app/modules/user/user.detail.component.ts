import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-user-detail',

  templateUrl: './user.detail.component.html',
})

export class UserDetailComponent {
  @ViewChild('detail', {static: false}) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

