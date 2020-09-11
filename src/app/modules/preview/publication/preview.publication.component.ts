import { Parameter, ElementKind, delay } from 'src/app/lib';
import { Component, Input } from '@angular/core';
import { ElementRevisionRef, PreviewService, Publication, getIcon, getElementKind, Factory } from '../../../lib';

@Component({
  selector: 'qddt-preview-publication',
  // templateUrl: './preview.publication.component.html',
  template: `
  <ul>
    <li class="collection-item" >
      <label>Name</label>
    </li>
    <li class="collection-item" >
      <p  [innerHtml]="publication?.name" ></p>
    </li>
    <li class="collection-item" >
      <label>Purpose</label>
    </li>
    <li class="collection-item" >
      <p [innerHtml]="publication?.purpose" ></p>
    </li>
    <li class="collection-item" >
      <label>Status</label>
    </li>
    <li class="collection-item" >
      <p  [innerHtml]="publication?.status.label"></p>
    </li>
  </ul>
  <ul class="collapsible row">
    <li *ngFor="let cqi of publication.publicationElements;let idx = index;" (click)="onOpenBody(cqi)">
      <div class="collapsible-header">
        <i  class="material-icons small teal-text text-lighten-3">{{getMatIcon(cqi.elementKind)}}</i>
        <div class="col s9 m10 grey-text text-darken-1" [innerHtml]=cqi.name></div>
        <qddt-version-label class="col s3 m2 right-align" [revisionRef]="cqi"></qddt-version-label>
      </div>
      <div class="collapsible-body">
        <div class="row" *ngIf="showProgressBar" class="progress">
          <div class="indeterminate"></div>
        </div>
        <qddt-preview-element [element]="cqi.element" [showDetail]="false" [inParameters]="inParameters">
        </qddt-preview-element>
      </div>

    </li>
  </ul>
  <qddt-element-footer [element]="publication"></qddt-element-footer>

  <qddt-comment-list [ownerId]="publication.id" [comments]="publication.comments"></qddt-comment-list>
  `,

})

export class PreviewPublicationComponent {
  @Input() publication: Publication;

  public inParameters = new Map<string, Parameter>();
  public compId = Math.round(Math.random() * 10000);
  public showProgressBar = false;
  public readonly trackByIndex = (index: number, cqi) => cqi.id;

  constructor(private service: PreviewService) { }


  public onOpenBody(item: ElementRevisionRef) {
    if (!item.element) {
      this.showProgressBar = true;
      delay(20).then(() => {
        const kind = getElementKind(item.elementKind);
        this.service.getRevisionByKind(item.elementKind, item.elementId, item.elementRevision).then(
          (result) => {
            item.element = Factory.createFromSeed(kind, result.entity);
            item.version = result.entity.version;
          },
          (error) => { throw error; })
          .finally(() => this.showProgressBar = false);
      });
    }
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

  // public getQueryInfo(kind): QueryInfo {
  //   return getQueryInfo(kind);
  // }


}
