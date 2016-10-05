import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionService } from './question.service';
import { Change } from '../../common/change_status';

@Component({
  selector: 'qddt-questionitem-edit',
  moduleId: module.id,
  providers: [QuestionService],
  template:
  `
  <div *ngIf="isVisible" class="card white grey-text text-darken-1">
    <div *ngIf="questionitem">
      <div class="card-action">
        <form (ngSubmit)="onEditQuestionItem()" #hf="ngForm">
          <div class="row"><span>Name</span>
            <input name="{{questionitem?.id}}-name" type="text" [(ngModel)]="questionitem.name">
          </div>
          <div class="row">
            <div class="row">
              <div class="input-field col s12">
                <textarea id="{{questionitem?.id}}-question-textarea"
                  name="{{questionitem?.id}}-question-textarea" [(ngModel)]="questionitem.question.question"
                  class="materialize-textarea" [attr.maxlength]="1500"></textarea>
                <label [attr.for]="questionitem.id + '-question-textarea'" class="active teal-text">Question text</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <textarea id="{{questionitem?.id}}-question-intent"
                  name="{{questionitem?.id}}-question-intent" [(ngModel)]="questionitem.question.intent"
                  class="materialize-textarea" [attr.maxlength]="1500"></textarea>
                <label [attr.for]="questionitem.id + '-question-intent'" class="active teal-text">Question intent</label>
              </div>
            </div>
          </div>
          <div *ngIf="editResponseDomain" class="row">
            <div class="row"><span>Response Domain</span></div>
              <div class="row col s1">
                <a materialize="leanModal" [materializeParams]="[{dismissible: false}]"
                  class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
                  [attr.href]="'#' + questionitem.id + '-edit-questionItem-modal'">
                  <i class="material-icons" title="response domain edit" (click)="onClickEdit()">mode_edit</i>
                </a>
              </div>
            <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
              (click)="onRemoveResponsedomain(questionitem)">
              <i class="material-icons left medium" title="remove response domain">remove</i>
            </a>
          </div>
          <div *ngIf="questionitem.changeKind" class="row">
				    <div class="input-field col s4">
					    <label class="active teal-text">Version Reason</label>
              <select
                name="{{questionitem?.id}}-questionitem-changeKind" 
						    [(ngModel)]="questionitem.changeKind"
						    materialize="material_select" required>
						    <option value="" disabled selected>Select reason</option>
						    <option *ngFor="let change of _ChangeEnums" [value]="change[0]">{{change[1]}}</option>
					    </select>
				    </div>
				    <div class="input-field col s8">
					    <input id="{{questionitem?.id}}-questionitemchangeComment"
                name="{{questionitem?.id}}-questionitemchangeComment"
                type="text" [(ngModel)]="questionitem.changeComment"
						    required> <label [attr.for]="questionitem.id + '-questionitemchangeComment'"
						    class="active teal-text">Save Comment</label>
				    </div>
			    </div>
          <div *ngIf="questionitem" class="row">
            <div class="input-field col s2">
              <p><label class="active teal-text">Version</label></p>
              {{questionitem?.version?.major}}.{{questionitem?.version?.minor}} {{questionitem?.version?.versionlabel}}
            </div>
            <div class="input-field col s4">
              <p><label class="active teal-text">Last Saved</label></p>
              <div>{{questionitem.modified | localDate}}</div>
            </div>
            <div class="input-field col s3">
              <p><label class="active teal-text">Last Saved By</label></p>
              <div class="chip" >{{questionitem?.modifiedBy?.username}}</div>
            </div>
            <div class="input-field col s3">
              <p><label class="active teal-text">Agency</label></p>
              <div class="chip" >{{questionitem?.modifiedBy?.agency?.name}}</div>
            </div>
          </div>
          <button type="submit" class="btn btn-default">Submit</button>
        </form>
      </div>
      <div *ngIf="editResponseDomain" [attr.id]="questionitem.id + '-edit-questionItem-modal'" class="modal">
        <div class="modal-content">
          <div *ngIf="showResponseDomainForm" class="row">
            <responsedomain-reuse [isVisible]="true"
                [responseDomain]="questionitem.responseDomain"
                (responseDomainReuse)="responseDomainReuse($event)">
              </responsedomain-reuse>
          </div>
        </div>
        <div class="modal-footer">
          <button id="questionItem-modal-close" class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
      </div>
    </div>
  </div>
`
})

export class QuestionItemEdit {
  @Input() isVisible: boolean;
  @Input() questionitem: any;
  @Input() editResponseDomain: boolean;
  @Output() editQuestionItem: EventEmitter<any>;
  private showResponseDomainForm: boolean;
  private _ChangeEnums: any;

  constructor(private service: QuestionService) {
    this.showResponseDomainForm = false;
    this._ChangeEnums = Change.status;
    this.editQuestionItem = new EventEmitter<any>();
  }

  onEditQuestionItem() {
    this.showResponseDomainForm = false;
    this.service.updateQuestionItem(this.questionitem)
      .subscribe((result: any) => {
        this.questionitem = result;
        this.editQuestionItem.emit(this.questionitem);
      });
    this.isVisible = false;
  }

  responseDomainReuse(responseDomain: any) {
    this.questionitem.responseDomain = responseDomain;
    this.showResponseDomainForm = false;
    document.getElementById('questionItem-modal-close').click();
  }

  onRemoveResponsedomain(questionitem: any) {
    questionitem.responseDomain = null;
    this.showResponseDomainForm = false;
  }

  onClickEdit() {
    this.showResponseDomainForm = true;
  }
}
