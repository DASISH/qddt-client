import {Component, Input} from 'angular2/core';

import {CategoryRevisionService} from './category_revision.service';

@Component({
  selector: 'category-revision',
  moduleId: module.id,
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="revisions">
      <table class="highlight hoverable">
        <thead>
          <tr>
              <th data-field="id"> # </th>
              <th data-field="id">Version</th>
              <th data-field="id">Timestamp</th>
              <th data-field="id">Reason</th>
              <th data-field="id">Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="#content of revisions.content">
              <td>{{content.metadata.revisionNumber}}</td>
              <td>{{content.entity.version.major}}.{{content.entity.version.minor}} {{content.entity.version.versionLabel}}</td>
              <td>{{content.metadata.delegate.timestamp | date:'dd MM yyyy HH:mm'}}</td>
              <td>{{content.entity.changeKind}}</td>
              <td>{{content.entity.changeComment}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>


  `,
  providers: [CategoryRevisionService]
})
export class CategoryRevision {

  @Input() categoryId: string;
  revisions: any;

  constructor(private service: CategoryRevisionService) {

  }

  ngAfterViewInit() {
    this.getRevisionsById(this.categoryId);
  }

  getRevisionsById(id: string) {
    this.service.getAllRevisions(id)
      .subscribe(
        (revisions: any) => this.revisions = revisions,
        (err: any) => CategoryRevisionService.logError('Unable to get all revisions')
      );
  }

  get diagnostic() { return JSON.stringify(this.revisions); }
}
