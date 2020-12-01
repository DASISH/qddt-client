import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-missing-detail',

  templateUrl: './missing.detail.component.html',
})

export class MissingDetailComponent {
  @ViewChild('detail', { static: true }) templateDetail;

  public onFormModified(event) {
    this.templateDetail.goBack();
  }
}

