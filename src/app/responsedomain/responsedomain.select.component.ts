import { Component, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { ResponseDomainService } from './responsedomain.service';

@Component({
  selector: 'qddt-responsedomain-select',
  moduleId: module.id,
  template: `
<div class="row card">
    <div class="row" *ngIf="selectedResponseDomain">
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
              [value]="revision.revisionNumber">{{ revision?.entity?.version?.major }}.{{ revision?.entity?.version?.minor }}
            </option>
          </select>
        </div>
        <div class="input-field col s7 ">
          <a class="waves-effect waves-light btn right red" (click)="onDismissResponsedomainSelect()">Dismiss</a>
          <a class="waves-effect waves-light btn right green" (click)="onUseResponseDomain()">Use this</a>
        </div>
      </div>
      <div class="row">
        <label for="seldesc" class="teal-text">Description</label>
        <span id="seldesc">{{selectedResponseDomain?.description}}</span>
      </div>
      <qddt-preview-responsedomain
        *ngIf="selectedResponseDomain"
        [responseDomain]="selectedResponseDomain">
      </qddt-preview-responsedomain>
    </div>
  </div>
  `,
})

export class ResponseDomainSelectComponent implements OnChanges {
  @Input() responseDomain;
  @Input() revision;
  @Output() useResponseDomainEvent = new EventEmitter<any>();
  @Output() dismissResponseSelect: any = new EventEmitter<any>();
  public responseDomains: any[];
  public selectedResponseDomainIndex: number;
  public selectedResponseDomain: any;

  public responseDomainRevisions: any[];
  public responseDomainRevision: number;

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
      this.service.getResponseDomainsRevisions(this.responseDomain.id).then((result: any) => {
        this.responseDomainRevisions = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.onSelectResponseDomainRevisions();
      });
    }
  }

  onSelectResponseDomainRevisions() {
    let r = this.responseDomainRevision;
    if (typeof r === 'string') {
      r = parseInt(r);
    }
    this.responseDomainRevision = r;
    const result = this.responseDomainRevisions
      .find((e: any) => e.revisionNumber === r);
    if (result !== null && result !== undefined) {
      this.selectedResponseDomain = result.entity;
    } else if (this.responseDomainRevisions.length > 0) {
      this.selectedResponseDomain = this.responseDomainRevisions[0].entity;
      this.responseDomainRevision = this.responseDomainRevisions[0].revisionNumber;
    }
  }

  onUseResponseDomain() {
    const object = {
      responseDomain: this.selectedResponseDomain,
      responseDomainRevision: this.responseDomainRevision
    };
    this.useResponseDomainEvent.emit(object);
  }

  onDismissResponsedomainSelect() {
    this.dismissResponseSelect.emit(true);
  }

}
