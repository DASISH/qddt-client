import {Component, Input} from 'angular2/core';

import {RevisionService} from './revision.service';
import {DiffComponent} from '../compare/diff.component';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

@Component({
  selector: 'qddt-revision',
  moduleId: module.id,
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="revisions">
      <qddt-diff *ngIf="selectRevisionId >= 0 && selectRevisionId !== currentRevisionId"
        [compared]="revisions[selectRevisionId].entity"
        [current]="revisions[currentRevisionId].entity"
        [config]="[{'name':'label','label':'Label'},{'name':'description','label':'Description'}]"
      >
      </qddt-diff>
      <div class="row">
        <div class="input-field col s4 right">
          <input id="{{qddtURI}}-revisions" type="checkbox" (click)="onIncludeRevisions($event)">
          <label [attr.for]="qddtURI + '-revisions'" class="active teal-text">
            include revisions
          </label>
        </div>
      </div>
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
          <tr *ngFor="#content of revisions;#idx=index">
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
  directives: [DiffComponent, MaterializeDirective],
  providers: [RevisionService]
})
export class RevisionComponent {

  @Input() qddtURI: string;
  @Input() isVisible: boolean;
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
      revisions => {
        this._revisions = revisions.content;
        this.filterRevisions();
      },
      (err: any) => console.log('Unable to get all revisions')
      );
  }

  onSelectRevision(id: number) {
    this.selectRevisionId = id;
  }

  onIncludeRevisions(e: any) {
    this.includeRevisions = e.target.checked;
    this.filterRevisions();
    this.selectRevisionId = -1;
  }

  get diagnostic() { return JSON.stringify(this.revisions);}

  private filterRevisions() {
    if (!this.includeRevisions) {
      this.revisions = this._revisions.filter(e => e.entity.changeKind !== 'IN_DEVELOPMENT');
    } else {
      this.revisions = this._revisions;
    }
    if (this.revisions.length > 0) {
      this.currentRevisionId = this.revisions.length - 1;
    }
  }

}
