import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-missing-detail',

  templateUrl: './missing.detail.component.html',
})

export class MissingDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

