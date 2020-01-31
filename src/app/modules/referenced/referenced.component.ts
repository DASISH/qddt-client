import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-referenced',

  templateUrl: './referenced.component.html'
})
export class ReferencedComponent {
  @ViewChild('detail', { static: true }) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
