import { Component, Output, EventEmitter, Input } from '@angular/core';

import { QuestionService, Question, QuestionItem } from './question.service';

@Component({
  selector: 'questionitem-reuseorcreate',
  providers: [QuestionService],
  template: `
      <a class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
        (click)="openModal()">
        <i class="material-icons left medium">playlist_add</i>
      </a>
      <div class="modal modal-fixed-footer"
        materialize [materializeActions]="actions">
        <div class="modal-content">
          <div class="switch">
            <label>New QuestionItem
              <input type="checkbox" [(ngModel)]="reuseQuestionItem"
              (ngModelChange)="onReuseQuestionItem()">
              <span class="lever"></span>
              Reuse QuestionItem
            </label>
          </div>
          <form #hf="ngForm">          
          <div *ngIf="!reuseQuestionItem">
            <h3 class="teal-text ">Add new Question Item</h3>
            <div class="row black-text">
              <div class="row"><span>Name</span>
                <input name="question-name" type="text" [(ngModel)]="questionItem.name" required>
              </div>
            </div>
            <div class="row black-text">
              <div class="row"><span>Question text</span>
                <textarea name="question-text"
                  [(ngModel)]="questionItem.question.question" required
                  class="materialize-textarea" [attr.maxlength]="1500"></textarea>
              </div>
            </div>
            <div class="row black-text">
              <div class="row"><span>Question intent</span>
                <input name="question-intent" type="text" [(ngModel)]="questionItem.question.intent" required>
              </div>
            </div>
            <div class="row black-text">
              <div class="row">
                <div class="card">
                  <div class="row teal-text"><span>Response Domain:</span></div>
                  <div class="row teal-text">
                    <a *ngIf="!questionItem.responseDomain"
                      class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
                      (click)="showResponsedomainReuse = true">
                      <i class="material-icons" title="response domain edit">mode_edit</i>
                    </a>
                    <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                      *ngIf="questionItem.responseDomain"
                      (click)="questionItem.responseDomain = null;secondCS=null;">
                      <i class="material-icons left medium" title="remove response domain">remove</i>
                    </a>
                    <span *ngIf="questionItem.responseDomain">{{questionItem?.responseDomain?.name}}</span>
                  </div>
                </div>
              </div>
              <responsedomain-reuse *ngIf="showResponsedomainReuse"
                [isVisible]="true"
                [responseDomain]="questionItem.responseDomain"
                (responseDomainReuse)="responseDomainReuse($event)">
              </responsedomain-reuse>
            </div>
            <div class="black-text card">
              <div class="row"><span>Missing</span></div>
              <div class="row">
                <autocomplete [items]="missingCategories" class="black-text"
                  [searchField]="'label'"
                  (autocompleteFocusEvent)="selectedCategoryIndex=idx;"
                  [initialValue]="''"
                  [searchFromServer]="true"
							    (enterEvent)="searchMissingCategories($event)"
                  (autocompleteSelectEvent)="select($event)">
                </autocomplete>
              </div>
              <table *ngIf="secondCS">
						    <thead><tr><td>Code</td><td>Category</td></tr></thead>
						    <tbody>
							    <tr *ngFor="let category of secondCS.children; let idx=index">
								    <td><input id="{{category?.id}}-code-value"
                      name="{{category?.id}}-code-value"
                      type="text" [(ngModel)]="category.code.codeValue" required></td>
								    <td>
									    {{category?.label}}
								    </td>
							    </tr>
						    </tbody>
					    </table>
            </div>
          </div>
          <div *ngIf="reuseQuestionItem">
            <h3 class="teal-text ">Reuse Question Item</h3>
            <div class="row black-text"><span>{{questionItem?.question?.question}}</span></div>
            <div class="row black-text">
              <autocomplete [items]="questionItems" [searchField]="['name', ['question','question']]"
                [initialValue]="''"
                [searchFromServer]="true"
                [isMutipleFields]="true"
                (autocompleteFocusEvent)="selectedIndex=idx;"
                (enterEvent)="searchQuestionItems($event)"
                [placeholder] = "'Search in question name or question text'"
                (autocompleteSelectEvent)="selectQuestionItem($event)">
              </autocomplete>
            </div>
          </div>
          </form>
        </div>
        <div class="modal-footer">
          <button (click)="onSave()" type="submit"
            class="btn btn-default modal-close green waves-green">Submit</button>
          <button
            class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
      </div>
  `
})
export class QuestionReuseComponent {
  @Input() parentId: string;
  @Output() questionItemCreatedEvent: EventEmitter<any> = new EventEmitter<any>();
  reuseQuestionItem: boolean;
  selectedIndex: number;
  secondCS: any;
  missingCategories: any[];
  selectedCategoryIndex: number;
  showResponsedomainReuse: boolean = false;
  actions = new EventEmitter<any>();
  private questionItem: QuestionItem;
  private questionItems: QuestionItem[];
  private mainresponseDomainRevision: number;

  constructor(private questionService: QuestionService) {
    this.questionItem = new QuestionItem();
    this.questionItem.question = new Question();
    this.questionItem.responseDomain = null;
    this.reuseQuestionItem = true;
    this.selectedIndex = 0;
    this.questionItems = [];
    this.secondCS = null;
    this.selectedCategoryIndex = 0;
    this.missingCategories = [];
    this.mainresponseDomainRevision = 0;
  }

  searchQuestionItems(name: string) {
    this.questionService.searchQuestionItemsByNameAndQuestion(name).subscribe((result: any) => {
      this.questionItems = result.content;
    });
  }

  searchMissingCategories(name: string) {
    this.questionService.getAllTemplatesByCategoryKind('MISSING_GROUP', name).subscribe((result: any) => {
      this.missingCategories = result.content;
    });
  }

  select(candidate: any) {
    this.secondCS = candidate;
  }

  onReuseQuestionItem() {
    if(!this.reuseQuestionItem) {
      this.questionItem = new QuestionItem();
      this.questionItem.question = new Question();
      this.questionItem.responseDomain = null;
    }
  }

  onSave() {
    if(!this.reuseQuestionItem) {
      this.questionItem.question.name = this.questionItem.question['question'];
      if (this.secondCS === null) {
        this.questionItem['responseDomainRevision'] = this.mainresponseDomainRevision;
        this.questionService.save(this.questionItem.question)
          .subscribe(result => {
            this.questionItem.question = result;
            this.questionService.createQuestionItem(this.questionItem)
              .subscribe(result => {
                this.questionItem = new QuestionItem();
                this.questionItem.question = new Question();
                this.questionItemCreatedEvent.emit(result);
              });
          });
      } else {
        this.questionItem['responseDomainRevision'] = 0;
        this.createMixedQuestionItem();
      }
    } else {
      this.questionItemCreatedEvent.emit(this.questionItem);
      this.questionItem = new QuestionItem();
    }
  }

  selectResponseDomain(responsedomain) {
    this.questionItem.responseDomain = responsedomain;
    this.showResponsedomainReuse = true;
  }

  responseDomainReuse(item: any) {
    this.questionItem.responseDomain = item.responseDomain;
    this.mainresponseDomainRevision = item.responseDomainRevision;
    this.showResponsedomainReuse = false;
  }

  selectQuestionItem(questionItem) {
    this.questionItem = questionItem;
  }

  openModal() {
    this.actions.emit('openModal');
    this.questionService.getQuestionItemPage().subscribe(
      result => { this.questionItems = result.content;
      }, (error: any) => console.log(error));
  }

  private createMixedQuestionItem() {
    this.createMixedCategory().subscribe((result: any) => {
      this.createMixedResponseDomain(result).subscribe((result: any) => {
        this.questionItem.responseDomain = result;
        this.questionService.updateQuestionItem(this.questionItem)
          .subscribe((result: any) => {
            this.questionItem = new QuestionItem();
            this.questionItem.question = new Question();
            this.questionItemCreatedEvent.emit(result);
          }, (err: any) => { console.log(err); });
      }, (err: any) => { console.log(err); });
    }, (err: any) => { console.log(err); });
  }

  private createMixedCategory() {
    let rep = {};
    rep['categoryType'] = 'MIXED';
    rep['hierarchyLevel'] = 'GROUP_ENTITY';
    rep['name'] = rep['description'] = 'mixed category';
    rep['children'] = [];
    if (this.questionItem.responseDomain !== null
      && this.questionItem.responseDomain !== undefined) {
      rep['children'].push(this.questionItem.responseDomain['managedRepresentation']);
    }
    if (this.secondCS !== null && this.secondCS !== undefined) {
      rep['children'].push(this.secondCS);
    }
    return this.questionService.createCategory(rep);
  }

  private createMixedResponseDomain(result: any) {
    let rd: any = {};
    rd['responseKind'] = 'MIXED';
    rd['description'] = '';
    let mainResponseDomain = this.questionItem.responseDomain;
    rd['name'] = (mainResponseDomain.name || ' ') + ' + ' + this.secondCS.name;
    rd['managedRepresentation'] = result;
    rd['displayLayout'] = mainResponseDomain['displayLayout'];
    let representation = rd['managedRepresentation'];
    for (let i = 0; i < representation.children.length; i++) {
      let category = representation.children[i];
      if (representation.children[i].categoryType === 'MISSING_GROUP') {
        for (let i = 0; i < category.children.length; i++) {
          category.children[i].code = this.secondCS.children[i].code;
        }
      } else {
        for (let i = 0; i < category.children.length; i++) {
          category.children[i].code = mainResponseDomain['managedRepresentation'].children[i].code;
        }
      }
    }
    return this.questionService.createResponseDomain(rd);
  }

}
