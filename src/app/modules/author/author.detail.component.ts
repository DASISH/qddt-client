import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'qddt-author-detail',

  templateUrl: './author.detail.component.html',
})

export class AuthorDetailComponent {
  @ViewChild('detail', {static: true}) templateDetail;

  public onFormModified(event) {
    this.templateDetail.onHideDetail();
  }
}

