import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-changelog',

  templateUrl: './changelog.component.html'
})
export class ChangeLogComponent {
  @ViewChild('detail', { static: true }) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
