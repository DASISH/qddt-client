import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { RevisionService } from './revision.service';

@Component({
  selector: 'qddt-revision',
  moduleId: module.id,
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="revisions">
      <qddt-diff *ngIf="selectRevisionId >= 0"
        [compared]="revisions[selectRevisionId].entity"
        [current]="current"
        [config]="config"
      >
      </qddt-diff>
      <table class="highlight hoverable">
        <thead>
          <tr>
              <th data-field="id"> # </th>
              <th data-field="id">Version</th>
              <th data-field="id">Compare</th>
              <th data-field="id">Timestamp</th>
              <th data-field="id">Reason</th>
              <th data-field="id">modifiedBy</th>
              <th data-field="id">Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let content of revisions; let idx=index">
              <td>{{content.metadata.revisionNumber}}</td>
              <td>{{content.entity.version.major}}.{{content.entity.version.minor}} {{content.entity.version.versionLabel}}</td>
              <td (click)="onSelectRevision(idx)" [ngStyle]="{'cursor': 'pointer'}">
                <i class="material-icons">transform</i>
              </td>
              <td>{{content.metadata.delegate.timestamp | date:'dd MM yyyy HH:mm'}}</td>
              <td>{{content.entity.changeKind}}</td>
              <td>{{content?.entity?.modifiedBy?.username}}</td>
              <td>{{content.entity.changeComment}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
  providers: [RevisionService]
})
export class RevisionComponent implements OnChanges, OnInit {

  @Input() qddtURI: string;
  @Input() isVisible: boolean;
  @Input() config: any[];
  @Input() current: any;
  private revisions: any[];
  private _revisions: any[];
  private selectRevisionId: number;
  private currentRevisionId: number;
  private includeRevisions: boolean;

  constructor(private service: RevisionService) {
    this.revisions = [];
    this._revisions = [];
    this.currentRevisionId = -1;
    this.selectRevisionId = -1;
    this.includeRevisions = false;
  }

  ngOnInit() {
    if(this.config === null || this.config === undefined) {
      this.config = [{'name':'label','label':'Label'},{'name':'description','label':'Description'}];
    }
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.getRevisionsById();
    } else {
      this.selectRevisionId = -1;
    }
  }

  getRevisionsById() {
    this.service.getAllRevisions(this.qddtURI)
      .subscribe(
      (revisions: any) => {
        this._revisions = revisions.content;
        this.filterRevisions();
      },
      (err: any) => console.log('Unable to get all revisions')
      );
  }

  onSelectRevision(id: number) {
    this.selectRevisionId = id;
  }

  get diagnostic() { return JSON.stringify(this.revisions);}

  private filterRevisions() {
    if (!this.includeRevisions) {
      this.revisions = this._revisions.filter((e: any) => e.entity.changeKind !== 'IN_DEVELOPMENT');
    } else {
      this.revisions = this._revisions;
    }
  }

}
