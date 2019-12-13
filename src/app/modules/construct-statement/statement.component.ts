import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-statement',

  templateUrl: './statement.component.html'
})
export class StatementComponent  {
  @ViewChild('detail', {static: true}) templateDetail;


  public onFormModified(event) {
    this.templateDetail.onToggleForm();
  }
}
