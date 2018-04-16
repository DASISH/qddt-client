import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-category-detail',
  moduleId: module.id,
  templateUrl: './missing-group.detail.component.html',
})

export class MissingGroupDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

