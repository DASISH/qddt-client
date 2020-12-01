import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-agency-detail',

  templateUrl: './agency.detail.component.html',
})

export class AgencyDetailComponent {
  @ViewChild('detail', { static: true }) templateDetail;

  public onFormModified(event) {
    this.templateDetail.goBack();
  }
}

