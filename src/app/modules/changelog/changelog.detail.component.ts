import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-changelog-detail',

  templateUrl: './changelog.detail.component.html',
})

export class ChangeLogDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

