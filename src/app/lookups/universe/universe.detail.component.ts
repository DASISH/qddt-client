import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-universe-detail',
  moduleId: module.id,
  templateUrl: './universe.detail.component.html',
})

export class UniverseDetailComponent {
  @ViewChild('detail') templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

