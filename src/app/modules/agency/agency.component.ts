import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-agency',

  templateUrl: './agency.component.html'
})
export class AgencyComponent {
  @ViewChild('detail', { static: true }) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
