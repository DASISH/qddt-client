import {Component, Input} from '../../../node_modules/angular2/core.d';

import {TopicRevisionService} from './topic_revisionservice';

@Component({
  selector: 'topic-revision',
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="revisions">
      <table>
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
  providers: [TopicRevisionService]
})
export class TopicRevision {

  @Input() topicId: string;
  revisions: any;

  constructor(private service: TopicRevisionService) {

  }

  ngAfterViewInit() {
    this.getRevisionsById(this.topicId);
  }

  getRevisionsById(id: string) {
    this.service.getAllRevisions(id)
      .subscribe(
        (revisions: any) => this.revisions = revisions,
        (err: any) => TopicRevisionService.logError('Unable to get all revisions')
      );
  }

  get diagnostic() { return JSON.stringify(this.revisions); }
}
