import {Component, Input} from 'angular2/core';
import {QuestionService} from './questionservice';
import {LocalDatePipe} from '../../common/date_pipe';
import {Question} from './questionservice';

@Component({
  selector: 'question-detail',
  providers: [QuestionService],
  pipes: [LocalDatePipe],
  template: `

  <div *ngIf="question" class="card" id="{{question.id}}"  >
    <form (ngSubmit)="save()" #hf="ngForm">
      <div class="row">
        <div class="input-field col s12">
          <input type="text" [(ngModel)]="question.name" required>
          <label for="name" class="active teal-text">Label</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" [(ngModel)]="question.question" required>
          <label for="question" class="active teal-text">Question</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" [(ngModel)]="question.intent" >
          <label for="intent" class="active teal-text">Intent</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" [(ngModel)]="question.basedOnObject" required>
          <label for="basedOnObject" class="active teal-text">Based On Object</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" [(ngModel)]="question.conceptReference" required>
          <label for="conceptReference" class="active teal-text">conceptReference</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" [(ngModel)]="question.gridIdx">
          <label for="gridIdx" class="active teal-text">Idx</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s12">
          <input type="text" [(ngModel)]="question.gridIdxRationale">
          <label for="name" class="active teal-text">Index Rationale</label>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s3">
          <p><label class="active teal-text">Version</label></p>
          {{question.version.major}}.{{question.version.minor}}.{{question.version.versionlabel}}
        </div>
        <div class="input-field col s3">
          <p><label class="active teal-text">Last Saved</label></p>
          <div>{{question.updated | localDate}}</div>
        </div>
        <div class="input-field col s3">
          <p><label class="active teal-text">Last Saved By</label></p>
          <div class="chip" >{{question.createdBy.username}}</div>
        </div>
        <div class="input-field col s3">
          <p><label class="active teal-text">Agency</label></p>
          <div class="chip" >{{question.createdBy.agency.name}}</div>
        </div>
      </div>
      <div class="row">
        <div class="input-field col s4">
            <label class="active teal-text">Version Reason</label>
            <select  class="browser-default input-sm"  [(ngModel)]="question.changeKind">
              <option *ngFor="#changereason of changes" [value]="changereason">{{changereason}}</option>
            </select>
        </div>
        <div class="input-field col s8">
          <input type="text" [(ngModel)]="question.changeComment" required>
          <label for="changeComment" class="active teal-text">Save Comment</label>
        </div>
      </div>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>
  </div>
`
})
export class QuestionDetail {

  @Input() question: Question;
  private changes: any;

  constructor(private service: QuestionService) {
    this.service = service;
    this.changes = ['IN_DEVELOPMENT','TYPO','NEW_MAJOR'];
  }

  ngAfterViewInit() {
    QuestionService.logError('Detail init');
  }

  save() {
    this.service.save(this.question);
  }
}
