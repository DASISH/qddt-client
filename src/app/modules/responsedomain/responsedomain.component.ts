import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-responsedomain',
  templateUrl: './responsedomain.component.html',
})

export class ResponseComponent {
  @ViewChild('detail', { static: true }) templateDetail;

  public onFormModified(_event) {
    this.templateDetail.onToggleForm();
  }
}
