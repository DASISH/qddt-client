import { Component, Input, EventEmitter, Output } from '@angular/core';

import { RevisionService } from './revision.service';

@Component({
  selector: 'qddt-revision-detail',
  moduleId: module.id,
  template: `
    <div *ngIf="element" class="row">
      <div class="input-field col s1">
        <p><label class="active teal-text">Version</label></p>
        <div class="chip">{{element?.version?.major}}.{{element?.version?.minor}}
        </div>
      </div>
      <div class="input-field col s3">
        <p><label class="active teal-text">Last Saved</label></p>
        <div class="chip">{{element?.modified | localDate}}</div>
      </div>
      <div class="input-field col s3">
        <p><label class="active teal-text">Last Saved By</label></p>
        <div class="chip">{{element?.modifiedBy?.username}}</div>
      </div>
      <div class="input-field col s3">
        <p><label class="active teal-text">Agency</label></p>
        <div class="chip">{{element?.modifiedBy?.agency?.name}}</div>
      </div>
      <div class="input-field col s2">
        <p><label class="active teal-text">Based On Object</label></p>
        <div *ngIf="element.basedOnObject" class="chip"
          [ngStyle]="{'cursor': 'pointer'}"
          (click)="onClick(element.basedOnObject)">
          Detail
        </div>
      </div>
      <div [attr.id]="element.id + '-detail-readonly-modal'" class="modal modal-fixed-footer"
        materialize [materializeActions]="elementActions">
        <div class="modal-content">
          <div class="row"
            *ngIf="basedon && (type === 'survey' || type === 'category'|| type === 'controlconstruct'|| type === 'concept')">
            <label>Version: {{basedon?.version?.major}}.{{basedon?.version?.minor}}</label>
            <div class="row">
              <label class="active teal-text">Name</label>
              <input type="text" [ngModel]="basedon.name" readonly>
            </div>
            <div class="row">
              <div class="col s12">
                <label class="active teal-text">Description</label>
                <textarea class="materialize-textarea"
                  [ngModel]="basedon.description" readonly></textarea>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s8">
                <p><label class="active teal-text">Authors</label></p>
                <qddt-author-chip [authors]="basedon.authors"></qddt-author-chip>
              </div>
              <div class="input-field col s4">
                <p><label class="active teal-text">Agency</label></p>
                <div class="chip">{{basedon.modifiedBy.agency.name}}</div>
              </div>
            </div>
          </div>
          <div class="row" *ngIf="id && type === 'study'">
            <qddt-study-usedby [id]="id">
            </qddt-study-usedby>
          </div>
          <div class="row" *ngIf="id && type === 'topic'">
            <qddt-topic-usedby [id]="id">
            </qddt-topic-usedby>
          </div>
          <div class="row" *ngIf="id && type === 'questionitem'">
            <qddt-question-usedby [id]="id">
            </qddt-question-usedby>
          </div>
          <div class="row" *ngIf="id && type === 'responsedomain'">
            <qddt-responsedomain-usedby [id]="id">
            </qddt-responsedomain-usedby>
          </div>
        </div>
        <div class="modal-footer">
          <button
            (click)="false"
            class="btn btn-default red modal-action modal-close waves-effect">
            <a><i class="close material-icons medium white-text">close</i></a>
          </button>
        </div>
      </div>
    </div>
  `,
  providers: [RevisionService]
})
export class RevisionDetailComponent {

  @Input() element: any;
  @Input() type: string;
  @Output() BasedonObjectDetail: any = new EventEmitter<string>();
  id: any;
  basedon: any;
  elementActions = new EventEmitter<string>();

  constructor(private service: RevisionService) {
    this.basedon = null;
  }

  onClick(id: string) {
    this.id = id;
    if (this.type !== 'questionitem'
      && this.type !== 'study'
      && this.type !== 'responsedomain'
      && this.type !== 'topic') {
      this.service.getelement(this.type, this.id)
        .subscribe(
        (result: any) => {
          this.basedon = result;
          this.elementActions.emit('openModal');
        },
        (err: any) => null
        );
    } else if (this.type === 'responsedomain') {
      this.BasedonObjectDetail.emit(id);
    } else {
      this.elementActions.emit('openModal');
    }
  }

}
