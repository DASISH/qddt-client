import {Component, Input} from 'angular2/core';
import {QuestionService} from './question.service';
import {Change} from '../../common/change_status';
import {LocalDatePipe} from '../../common/date_pipe';
import {ResponsedomainFormComponent} from '../responsedomain/responsedomain.form.component';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {ResponsedomainReuseComponent} from '../responsedomain/responsedomain.reuse.component';

@Component({
  selector: 'qddt-questionitem-edit',
  moduleId: module.id,
  pipes: [LocalDatePipe],
  directives: [ResponsedomainFormComponent, MaterializeDirective, ResponsedomainReuseComponent],
  providers: [QuestionService],
  template:
  `
  <div *ngIf="isVisible" class="card white grey-text text-darken-1">
    <div *ngIf="questionitem">
      <div class="card-action">
        <form (ngSubmit)="onEditQuestionItem()" #hf="ngForm">
          <div class="row"><span>Name</span>
            <input type="text" [(ngModel)]="questionitem.name">
          </div>
          <div class="row">
            <div class="row"><span>Question text</span>
              <input type="text" [(ngModel)]="questionitem.question.question">
            </div>
          </div>
          <div class="row">
            <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
            (click)="showResponseDomainForm = !showResponseDomainForm">
            <i class="material-icons" title="response domain edit">mode_edit</i>
            </a>
            <div *ngIf="showResponseDomainForm" class="row card">
			        <responsedomain-reuse [isVisible]="true"
                [responseDomain]="questionitem.responseDomain"
                (responseDomainReuse)="responseDomainReuse($event)">
              </responsedomain-reuse>
		        </div>
          </div>
          <div *ngIf="!showResponseDomainForm && questionitem.changeKind" class="row">
				    <div class="input-field col s4">
					    <label class="active teal-text">Version Reason</label>
              <select
						    [(ngModel)]="questionitem.changeKind"
						    materialize="material_select" required>
						    <option value="" disabled selected>Select reason</option>
						    <option *ngFor="#change of _ChangeEnums" [value]="change[0]">{{change[1]}}</option>
					    </select>
				    </div>
				    <div class="input-field col s8">
					    <input id="questionitemchangeComment" type="text" [(ngModel)]="questionitem.changeComment"
						    required> <label for="questionitemchangeComment"
						    class="active teal-text">Save Comment</label>
				    </div>
			    </div>
          <div *ngIf="!showResponseDomainForm && questionitem" class="row">
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
          <button *ngIf="!showResponseDomainForm" type="submit" class="btn btn-default">Submit</button>
        </form>
      </div>
    </div>
  </div>
`
})

export class QuestionItemEdit {
  @Input() isVisible: boolean;
  @Input() questionitem: any;
  private showResponseDomainForm: boolean;
  private _ChangeEnums: any;

  constructor(private service: QuestionService) {
    this.showResponseDomainForm = false;
    this._ChangeEnums = Change.status;
  }

  onEditQuestionItem() {
    this.showResponseDomainForm = false;
    this.questionitem.question.name = this.questionitem.question.question;
    this.service.updateQuestionItem(this.questionitem)
      .subscribe(result => {
        this.questionitem = result;
      });
    this.isVisible = false;
  }

  responseDomainReuse(responseDomain: any) {
    this.questionitem.responseDomain = responseDomain;
    this.showResponseDomainForm = false;
  }
}
