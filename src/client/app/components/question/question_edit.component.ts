import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { QuestionService } from './question.service';
import { DomainType } from '../responsedomain/responsedomain.constant';
import { Observable }     from 'rxjs/Observable';

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
          <div class="row">
            <label [attr.for]="questionitem.id + '-question-name'" class="active teal-text">Name</label>
            <input name="{{questionitem?.id}}-question-name" type="text" [(ngModel)]="questionitem.name">
          </div>
          <div class="row">
            <div class="row">
              <div class="col s12">
                <label [attr.for]="questionitem.id + '-question-textarea'" class="active teal-text">Question text</label>                
                <textarea id="{{questionitem?.id}}-question-textarea"
                  name="{{questionitem?.id}}-question-textarea" [(ngModel)]="questionitem.question.question"
                  class="materialize-textarea" [attr.maxlength]="1500"></textarea>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <label [attr.for]="questionitem.id + '-question-intent'" class="active teal-text">Question intent</label>                
                <textarea id="{{questionitem?.id}}-question-intent"
                  name="{{questionitem?.id}}-question-intent" [(ngModel)]="questionitem.question.intent"
                  class="materialize-textarea" [attr.maxlength]="1500"></textarea>
              </div>
            </div>
          </div>
          <div *ngIf="editResponseDomain" class="row">
            <div class="card col s6">
              <div class="row"><span>Response Domain</span></div>
              <div class="row">
                <a *ngIf="!mainResponseDomain" materialize="leanModal" [materializeParams]="[{dismissible: false}]"
                  class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
                  [attr.href]="'#' + questionitem.id + '-edit-questionItem-modal'">
                  <i class="material-icons" title="response domain edit" (click)="onClickEdit()">mode_edit</i>
                </a>
                <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                  (click)="onRemoveResponsedomain(questionitem)">
                  <i class="material-icons left medium" title="remove response domain">remove</i>
                </a>
                <span *ngIf="mainResponseDomain">{{mainResponseDomain?.name}}</span>
              </div>
            </div>
            <div class="col s6">
              <div name="edit-missing-responsedomain" *ngIf="editResponseDomain" class="row">
              <qddt-questionitem-edit-missing [missing]="secondCS"
                (editMissing)="onEditMissing($event)"></qddt-questionitem-edit-missing>
              </div>
            </div>
          </div>
          <div class="row card">
            <table class="highlight" *ngIf="concepts.length > 0">
              <thead><tr><th>Detail</th><th>Concept Names</th></tr></thead>
              <tbody>
                <tr *ngFor="let row of concepts">
                  <td [ngStyle]="{'cursor': 'pointer'}" (click)="onClickConcept(row)">
                    <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal">
                     <i class="material-icons left smal">search</i>
                    </a>
                  </td>
                  <td>{{row?.name}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="row">
            <qddt-rational [element]="questionitem"></qddt-rational>
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
      <div *ngIf="editResponseDomain" [attr.id]="questionitem.id + '-edit-questionItem-modal'" class="modal modal-fixed-footer">
        <div class="modal-content">
          <div *ngIf="showResponseDomainForm" class="row">
            <responsedomain-reuse [isVisible]="true"
              [responseDomain]="mainResponseDomain"
              (responseDomainReuse)="responseDomainReuse($event)">
            </responsedomain-reuse>
          </div>
        </div>
        <div class="modal-footer">
          <button id="questionItem-modal-close" class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
      </div>
    </div>
    <div [attr.id]="'concept-detail-modal'" class="modal modal-fixed-footer"
      materialize [materializeActions]="conceptActions">
      <div class="modal-content" *ngIf="concepts.length > 0 && selectedConcept">
        <h4>Concept {{selectedConcept?.name}}</h4>
        <qddt-question-treenode [concept]="selectedConcept"></qddt-question-treenode>
      </div>
      <div class="modal-footer">
        <button id="concept-modal-close"
          class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
      </div>
    </div>
  </div>
`
})

export class QuestionItemEdit implements OnInit {
  @Input() isVisible: boolean;
  @Input() questionitem: any;
  @Input() editResponseDomain: boolean;
  @Output() editQuestionItem: EventEmitter<any>;
  selectedConcept: any;
  conceptActions = new EventEmitter<string>();
  private showResponseDomainForm: boolean;
  private mainResponseDomain: any;
  private secondCS: any;
  private concepts: any[];

  constructor(private service: QuestionService) {
    this.showResponseDomainForm = false;
    this.editQuestionItem = new EventEmitter<any>();
    this.concepts = [];
  }

  ngOnInit() {
    this.mainResponseDomain = null;
    this.secondCS = null;
    if (!this.isNull(this.questionitem.responseDomain)) {
      if (this.questionitem.responseDomain['responseKind'] === 'MIXED') {
        let rep = this.questionitem.responseDomain.managedRepresentation;
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
            rd['responseCardinality'] = {minimum: '1', maximum: '1'};
            rd['managedRepresentation'] = rep.children[i];
            this.mainResponseDomain = rd;
          }
        }
      } else {
        this.mainResponseDomain = this.questionitem.responseDomain;
      }
    }
    if(this.questionitem.id !== null || this.questionitem.id !== undefined) {
      this.service.getConceptsByQuestionitemId(this.questionitem.id)
        .subscribe(
        (result: any) => {
        this.concepts = result;
        },
        (error: any) => { console.log(error); });
    }
  }

  onClickConcept(concept: any) {
    this.selectedConcept = concept;
    this.conceptActions.emit('openModal');
  }

  onEditQuestionItem() {
    this.showResponseDomainForm = false;
    this.getMixedCategory().subscribe((result: any) => {
      this.getMixedResponseDomain(result).subscribe((result: any) => {
        this.questionitem.responseDomain = result;
        this.service.updateQuestionItem(this.questionitem)
          .subscribe((result: any) => {
            this.questionitem = result;
            this.editQuestionItem.emit(this.questionitem);
          });
      }, (err:any) => {console.log(err);});
    }, (err:any) => {console.log(err);});
    this.isVisible = false;
  }

  onEditMissing(missing: any) {
    this.secondCS = missing;
  }

  responseDomainReuse(responseDomain: any) {
    this.mainResponseDomain = responseDomain;
    this.showResponseDomainForm = false;
    document.getElementById('questionItem-modal-close').click();
  }

  onRemoveResponsedomain(questionitem: any) {
    this.mainResponseDomain = null;
    this.secondCS = null;
    this.showResponseDomainForm = false;
  }

  onClickEdit() {
    this.showResponseDomainForm = true;
  }

  private getManagedRepresentation() {
    let rep: any = {};
    if (!this.isNull(this.secondCS)
      && (this.isNull(this.questionitem.responseDomain)
      || this.isNull(this.questionitem.responseDomain['managedRepresentation'])
      || this.questionitem.responseDomain['responseKind'] !== 'MIXED')) {
      rep = {};
      rep['categoryType'] = 'MIXED';
      rep['hierarchyLevel'] = 'GROUP_ENTITY';
      rep['name'] = rep['description'] = 'mixed category';
      rep['children'] = [];
    } else if (!this.isNull(this.questionitem.responseDomain)
      && !this.isNull(this.questionitem.responseDomain['managedRepresentation'])) {
      rep = this.questionitem.responseDomain['managedRepresentation'];
      rep['children'] = [];
    } else if (!this.isNull(this.mainResponseDomain)) {
      rep = this.mainResponseDomain['managedRepresentation'];
    }
    return rep;
  }

  private getMixedCategory() {
    let isMixed: boolean = !this.isNull(this.questionitem.responseDomain)
      && !this.isNull(this.questionitem.responseDomain['responseKind'])
      && this.questionitem.responseDomain['responseKind'] === 'MIXED';
    if (!this.isNull(this.secondCS) && !isMixed) {
      let rep = this.getManagedRepresentation();
      if (!this.isNull(this.mainResponseDomain)) {
        rep['children'].push(this.mainResponseDomain['managedRepresentation']);
      }
      if (!this.isNull(this.secondCS)) {
        rep['children'].push(this.secondCS);
      }
      return this.service.createCategory(rep);
    } else if (!this.isNull(this.secondCS) && isMixed) {
      let rep = this.getManagedRepresentation();
      this.updateChild(rep, this.secondCS, 'MISSING_GROUP');
      if (this.mainResponseDomain !== null) {
        this.updateChild(rep, this.mainResponseDomain['managedRepresentation'],
          this.mainResponseDomain['managedRepresentation'].categoryType);
      }
      return Observable.of(rep);
    } else if (this.isNull(this.mainResponseDomain) && this.isNull(this.secondCS)) {
      return Observable.of(null);
    } else if (isMixed && this.isNull(this.secondCS)) {
      let rep = this.questionitem.responseDomain['managedRepresentation'];
      this.deleteChild(rep, 'MISSING_GROUP');
      return Observable.of(rep);
    } else {
      let rep = this.getManagedRepresentation();
      return Observable.of(rep);
    }
  }

  private updateChild(representation: any, object: any, categoryType: string) {
    if (this.isNull(representation.children) || this.isNull(object)) {
      return;
    }
    let index = representation.children.findIndex((e: any) => e.categoryType === categoryType);
    if (index >= 0) {
      representation.children[index] = object;
    } else {
      representation.children.push(object);
    }
  }

  private deleteChild(representation: any, categoryType: string) {
    if (this.isNull(representation.children)) {
      return;
    }
    let index = representation.children.findIndex((e: any) => e.categoryType === categoryType);
    if (index >= 0) {
      representation.children.splice(index, 1);
    }
  }

  private getMixedResponseDomain(result: any) {
    if (!this.isNull(this.secondCS)
      && (this.isNull(this.questionitem.responseDomain)
        || this.questionitem.responseDomain['responseKind'] !== 'MIXED')) {
      let rd: any = {};
      rd['responseKind'] = 'MIXED';
      rd['description'] = '';
      rd['name'] = this.mainResponseDomain.name + ' + ' + this.secondCS.name;
      rd['managedRepresentation'] = result;
      if (!this.isNull(this.mainResponseDomain)) {
        rd['displayLayout'] = this.mainResponseDomain['displayLayout'];
      }
      this.updateCodeValues(rd['managedRepresentation']);
      return this.service.createResponseDomain(rd);
    } else if (this.isNull(this.mainResponseDomain) && this.isNull(this.secondCS)) {
      return Observable.of(null);
    }
    if(!this.isNull(this.questionitem.responseDomain)
      && !this.isNull(this.questionitem.responseDomain['managedRepresentation'])) {
      this.questionitem.responseDomain['managedRepresentation'] = result;
      if (!this.isNull(this.mainResponseDomain)) {
        this.questionitem.responseDomain['displayLayout'] = this.mainResponseDomain['displayLayout'];
      }
      this.updateCodeValues(this.questionitem.responseDomain['managedRepresentation']);
    } else {
      this.questionitem.responseDomain = this.mainResponseDomain;
    }
    return Observable.of(this.questionitem.responseDomain);
  }

  private updateCodeValues(representation: any) {
    for (let i = 0; i < representation.children.length; i++) {
      let category = representation.children[i];
      if (representation.children[i].categoryType === 'MISSING_GROUP') {
        for (let i = 0; i < category.children.length; i++) {
          category.children[i].code = this.secondCS.children[i].code;
        }
      } else {
        for (let i = 0; i < category.children.length; i++) {
          category.children[i].code = this.mainResponseDomain['managedRepresentation'].children[i].code;
        }
      }
    }
  }

  private isNull(object: any) {
    return object === undefined || object === null;
  }

}
