import { Component, Input, OnInit } from '@angular/core';
import { PublicationStatus, PublicationService, ElementTypes } from './publication.service';
import { Subject } from 'rxjs/Subject';

enum DomainType {
  SCALE = 1,
  LIST,
  MIXED,
  DATETIME,
  NUMERIC,
  TEXT,
  MISSING,
};

@Component({
  selector: 'qddt-publication-questionitem-preview',
  moduleId: module.id,
  template:
  `
  <div *ngIf="element">
    <div class="row">
      <ul class="collection with-header black-text">
        <li class="collection-header">Question Item</li>
        <li  class="collection-item">Version: {{element?.version?.major}}.
          {{element?.version?.minor}}
        </li>
        <li class="collection-item">Name: {{element?.name}}</li>
        <li class="collection-item">Question Text: {{element?.question?.question}}</li>
        <li class="collection-item">Intent: {{element?.question?.intent}}</li>
      </ul>
    </div>
    <qddt-responsedomain-preview *ngIf="element.responseDomain"
      [isVisible]="true" [responseDomain]="element.responseDomain">
    </qddt-responsedomain-preview>
    <div class="card row">
      <div class="col s6">
        <div class="row"><span>Response Domain:<span *ngIf="mainResponseDomain && mainResponseDomain.managedRepresentation">
          (V{{mainResponseDomain?.managedRepresentation?.version?.major}}<!--
          -->.{{mainResponseDomain?.managedRepresentation?.version?.minor}})</span></span>
        </div>
        <div class="row">
          <span *ngIf="mainResponseDomain">{{mainResponseDomain?.name}}</span>
        </div>
      </div>
      <div class="col s6">
        <div class="card">
          <div class="row"><span>Missing</span></div>
          <div class="row">
            <span *ngIf="secondCS">{{secondCS?.name}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <ul class="collection with-header black-text">
        <li class="collection-item" *ngFor="let c of element.conceptRefs" >Concept: {{c?.name}}</li>
      </ul>
    </div>
  </div>
  `,
  providers: [ ],
})

export class PublicationQuestionitemPreviewComponent implements OnInit {
  @Input() element: any;
  private mainResponseDomain: any;
  private secondCS: any;

  ngOnInit() {
    this.mainResponseDomain = null;
    this.secondCS = null;
    if (this.element.responseDomain !== null
      && this.element.responseDomain !== undefined) {
      if (this.element.responseDomain['responseKind'] === 'MIXED') {
        let rep = this.element.responseDomain.managedRepresentation;
        for (let i = 0; i < rep.children.length; i++) {
          if (rep.children[i].categoryType === 'MISSING_GROUP') {
            this.secondCS = rep.children[i];
          } else {
            let rd = {};
            rd['id'] = new Date().toString();
            if (rep.children[i].categoryType === 'SCALE') {
              rd['domainType'] = DomainType.SCALE;
              rd['responseKind'] = 'SCALE';
            } else if (rep.children[i].categoryType === 'NUMERIC') {
              rd['domainType'] = DomainType.NUMERIC;
              rd['responseKind'] = 'NUMERIC';
            } else if (rep.children[i].categoryType === 'TEXT') {
              rd['domainType'] = DomainType.TEXT;
              rd['responseKind'] = 'TEXT';
            } else if (rep.children[i].categoryType === 'LIST') {
              rd['domainType'] = DomainType.LIST;
              rd['responseKind'] = 'LIST';
            }
            rd['name'] = rep.children[i]['name'] || '';
            rd['responseCardinality'] = { minimum: '1', maximum: '1' };
            rd['managedRepresentation'] = rep.children[i];
            this.mainResponseDomain = rd;
          }
        }
      } else {
        this.mainResponseDomain = this.element.responseDomain;
      }
    }
  }
}
