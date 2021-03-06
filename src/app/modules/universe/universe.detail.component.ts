import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-universe-detail',

  templateUrl: './universe.detail.component.html',
})

export class UniverseDetailComponent {
  @ViewChild('detail', { static: true }) templateDetail;

  public onFormModified(event) {
    this.templateDetail.goBack();
  }
}

