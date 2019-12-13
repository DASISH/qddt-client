import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-condition-detail',
  templateUrl: './condition.detail.component.html',
})

export class ConditionDetailComponent {
  @ViewChild('detail', {static: true}) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

