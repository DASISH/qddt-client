import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { ResponseDomainService } from './responsedomain.service';

@Component({
  selector: 'qddt-responsedomain-select',
  moduleId: module.id,
  template: `
  <div class="row card">
    <div class="row" *ngIf="selectedResponseDomain">
      <div class="row">
        <ul class="collection with-header black-text">
          <li class="collection-header">Response domain</li>
          <li class="collection-item">Version: {{selectedResponseDomain?.version?.major}}.
            {{selectedResponseDomain?.version?.minor}}
          </li>
          <li class="collection-item">Name: {{selectedResponseDomain?.name}}</li>
          <li class="collection-item">Description: {{selectedResponseDomain?.description}}</li>
        </ul>
      </div>
      <qddt-responsedomain-preview
        *ngIf="selectedResponseDomain"
        [isVisible]="true" [responseDomain]="selectedResponseDomain">
      </qddt-responsedomain-preview>
      <div class="row">
        <div class="input-field col s4" *ngIf="responseDomainRevisions.length > 0">
          <label class="active black-text">responseDomain business version</label>
          <select [(ngModel)]="responseDomainRevision"
            (ngModelChange)="onSelectResponseDomainRevisions($event)"
            class="black-text"
            name="questionItem-responseDomainRevision"
            materialize="material_select">
            <option *ngFor="let revision of responseDomainRevisions"
              [selected]="revision.revisionNumber === responseDomainRevision"
              [value]="revision.revisionNumber">
              {{revision?.entity?.version?.major}}.{{revision?.entity?.version?.minor}}
            </option>
          </select>
        </div>
        <div class="input-field col s6 right">
          <a class="waves-effect waves-light btn  green" (click)="onUseResponseDomain()">Use this</a>
          <a class="waves-effect waves-light btn  red" (click)="onDismiss()">Dismiss</a>
        </div>
      </div>
    </div>
  </div>
  `,
  providers: [ ResponseDomainService ],
})

export class ResponseDomainSelectComponent implements OnChanges {
  @Input() responseDomain;
  @Input() revision;
  @Output() useResponseDomainEvent = new EventEmitter<any>();
  @Output() dismissEvent: any = new EventEmitter<any>();
  error: any;
  responseDomains: any[];
  selectedResponseDomainIndex: number;
  private responseDomainRevisions: any[];
  private selectedResponseDomain: any;
  private responseDomainRevision: number;

  constructor(private service: ResponseDomainService) {
    this.responseDomains = [];
    this.selectedResponseDomainIndex = -1;
    this.responseDomainRevision = 0;
    this.responseDomainRevisions = [];
  }

  ngOnChanges() {
    this.responseDomainRevisions = [];
    this.selectedResponseDomainIndex = -1;
    this.selectedResponseDomain = null;
    if (this.responseDomain !== null && this.responseDomain !== undefined
      && this.responseDomain.id !== null && this.responseDomain.id !== undefined) {
      this.service.getResponseDomainsRevisions(this.responseDomain.id).subscribe((result: any) => {
        this.responseDomainRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.onSelectResponseDomainRevisions();
      },
        (error: any) => { this.popupModal(error); });
    }
  }

  onSelectResponseDomainRevisions() {
    let r = this.responseDomainRevision;
    if(typeof r === 'string') {
      r = parseInt(r);
    }
    this.responseDomainRevision = r;
    let result = this.responseDomainRevisions
      .find((e: any) => e.revisionNumber === r);
    if(result !== null && result !== undefined) {
      this.selectedResponseDomain = result.entity;
    } else if(this.responseDomainRevisions.length > 0) {
      this.selectedResponseDomain = this.responseDomainRevisions[0].entity;
      this.responseDomainRevision = this.responseDomainRevisions[0].revisionNumber;
    }
  }

  onUseResponseDomain() {
    let object = {
      responseDomain: this.selectedResponseDomain,
      responseDomainRevision: this.responseDomainRevision
    };
    this.useResponseDomainEvent.emit(object);
  }

  onDismiss() {
    this.dismissEvent.emit(true);
  }

  private popupModal(error: any) {
    this.error = error;
    this.selectedResponseDomain = this.responseDomain;
  }

}
