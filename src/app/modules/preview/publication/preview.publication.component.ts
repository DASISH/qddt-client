import { Component, Input } from '@angular/core';
import {getQueryInfo, ElementRevisionRef, PreviewService, Publication, QueryInfo} from '../../../lib';

@Component({
  selector: 'qddt-preview-publication',
  // templateUrl: './preview.publication.component.html',
    template: `
  <div class="row">
    <div class="input-field col s11">
      <label class="teal-text active">Name</label>
      <P [innerHtml]="publication?.name"></P>
    </div>
  </div>
  <div class="row">
    <div class="input-field col s11">
      <label class="teal-text active">Purpose</label>
      <P [innerHtml]="publication?.purpose"></P>
    </div>
  </div>
  <div class="row">
    <div class="input-field col s11">
      <label class="teal-text active">Status</label>
      <P [innerHtml]="publication?.status.label"></P>
    </div>
  </div>

  <div class="row">
    <div *ngIf="publication?.publicationElements && publication?.publicationElements?.length > 0" class="section">
      <ul *ngIf="publication?.publicationElements" class="collapsible popout"
          data-collapsible="expandable" style="padding: 5pt;">
        <li *ngFor="let cqi of publication.publicationElements;" (click)="onViewDetail(cqi)">
          <div class="collapsible-header green lighten-5">
            <div class="col s2">[{{ getQueryInfo(cqi?.elementKind).label }}]</div>
            <div class="col s8">{{ cqi?.name }}</div>
            <div class="col s2">
              <qddt-version-label [element]="cqi"></qddt-version-label>
            </div>
          </div>
          <div class="collapsible-body">
            <qddt-preview-element *ngIf="cqi.element" [element]="cqi.element"></qddt-preview-element>
          </div>
        </li>
      </ul>
    </div>

    <qddt-element-footer [element]="publication"></qddt-element-footer>

    <qddt-comment-list [ownerId]="publication.id" [comments]="publication.comments"></qddt-comment-list>
  </div>
  `,

})

export class PreviewPublicationComponent  {
  @Input() publication: Publication;

  constructor(private service: PreviewService) { }

  onViewDetail(element: ElementRevisionRef) {
    if (!element.element) {
      this.service.getRevisionByKind(element.elementKind, element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { throw error; });
    }
  }
  public  getQueryInfo(kind): QueryInfo {
    return getQueryInfo(kind);
  }

}
