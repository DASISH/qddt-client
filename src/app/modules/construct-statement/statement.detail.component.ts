import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-statement-detail',
  templateUrl: './statement.detail.component.html',
})

export class StatementDetailComponent {
  @ViewChild('detail', { static: true }) templateDetail;

  public onFormModified(event) {
    this.templateDetail.goBack();
  }
}

