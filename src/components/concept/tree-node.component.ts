import { Component, Input} from 'angular2/core';
import {LocalDatePipe} from '../../common/date_pipe';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {RevisionComponent} from '../revision/revision.component';
import {ConceptQuestionComponent} from './concept_question.component';
import {ConceptEditComponent} from './edit/concept_edit.component';
import {CommentListComponent} from '../comment/comment_list.component';
import {ConceptService, Concept} from './concept.service';
import {AuthorChipComponent} from '../author/author_chip.component';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {QuestionItem} from '../question/question.service';
import {ResponseDomainService} from '../responsedomain/responsedomain.service';
import {ResponseDomainSearchComponent} from '../responsedomain/responsedomain.search';

@Component({
  selector: 'treenode',
  providers: [ConceptService, ResponseDomainService],
  directives: [TreeNodeComponent, ConceptQuestionComponent, MaterializeDirective, RevisionComponent,
              ConceptEditComponent, CommentListComponent, AuthorChipComponent,
              ResponseDomainSearchComponent, AutocompleteComponent],
  pipes: [LocalDatePipe],
  styles: [
    '.tree-children { padding-left: 5px }',
    `.tree-node {
        border-style: solid;
        border-color: green;
    }`
  ],
  template: `
    <div *ngIf="concept.name" class="row card">
      <div id="{{concept.id}}" class="scrollspy">
         <div class="col s1 m1 l1">
           <br />
           <div class="row">
             <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                   (click)="edit.isVisible = !edit.isVisible"><i class="material-icons">mode_edit</i></a>
             <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                   (click)="revision.isVisible = !revision.isVisible"><i class="material-icons left medium">history</i></a>
             <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                   (click)="onCreateQuestionItem(concept)"><i class="material-icons left medium">playlist_add</i></a>
             <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                   (click)="onCreateConcept(concept)"><i class="material-icons left medium">add</i></a>
             </div>
           </div>

           <div class="col s11 m11 l11 grey-text text-darken-2">
             <h5>{{concept.name}}</h5>
             {{concept.modified | localDate}} by <strong>{{concept.modifiedBy.username}}@{{concept.modifiedBy.agency.name}}</strong>
           </div>

           <div class="col s11 m11 l11 white grey-text text-darken-1">
             <div class="row">
               <p>{{concept.description}}</p>
               <author-chip [authors]="concept.authors" ></author-chip>
              </div>
           <div *ngIf="showConceptChildForm">
             <div class="card-action">
               <form (ngSubmit)="onChildSave()" #hf="ngForm">
                 <div class="row">
                   <div class="input-field col">
                     <input id="name" type="text" [(ngModel)]="newchild.name" required>
                     <label for="name" class="blue-text">Name</label>
                   </div>
                 </div>
                 <div class="row">
                   <div class="input-field col s11">
                     <textarea id="description" class="materialize-textarea" [(ngModel)]="newchild.description" required></textarea>
                     <label for="description" class="blue-text">Description</label>
                   </div>
                 </div>
                 <button type="submit" class="btn btn-default">Submit</button>
                 </form>
             </div>
           </div>
           <concept-edit [isVisible]="edit.isVisible" [concept]="concept" #edit></concept-edit>
           <qddt-revision [isVisible]="revision.isVisible" [qddtURI]="'audit/concept/' + concept.id + '/all'" #revision ></qddt-revision>
           <div *ngIf="concept.questionItems.length > 0" class="section">
             <ul class="collection with-header">
               <li class="collection-header">Questions</li>
               <li class="collection-item" *ngFor="#questionItem of concept.questionItems">
                 <div>
                   <i class="material-icons tiny">help</i> {{questionItem.question.question}}
                   <a href="#!" class="secondary-content"
                     (click)="removeQuestionItem(questionItem.id)"><i class="material-icons">delete_forever</i></a>
                 </div>
               </li>
             </ul>
           </div>
           <div *ngIf="showQuestionForm">
             <div class="card-action">
               <div class="row"><span>Create a Question Item</span></div>
               <form (ngSubmit)="onQuestionItemSave()" #hf="ngForm">
                 <div class="row">
                   <div class="row"><span>Select a Question text</span></div>
                   <autocomplete [items]="allQuestions" [searchField]="'name'"
                     (autocompleteFocusEvent)="showAutoComplete = true;"
                     [initialValue]="''" (autocompleteSelectEvent)="select($event)">
                   </autocomplete>
                 </div>
                 <div class="row">
                     <responsedomain-search (selectResponseDomainEvent)="selectResponseDomain($event)"></responsedomain-search>
                 </div>
                 <button type="submit" class="btn btn-default">Submit</button>
                 </form>
             </div>
           </div>
           <div class="row">
             <comment-list [ownerId]="concept.id"></comment-list>
           </div>
           <div class="tree-children">
             <treenode *ngFor="#child of concept.children" [concept]="child" [allQuestions]="allQuestions"></treenode>
           </div>
    </div></div></div>
  `
})

export class TreeNodeComponent {
  @Input() concept: any;
  @Input() allQuestions: any;
  showConceptChildForm: boolean = false;
  showQuestionForm: boolean = false;
  private newchild: any;
  private questionItem: any;

  constructor(private conceptService: ConceptService,
    private responseDomainService: ResponseDomainService) {
    this.newchild = new Concept();
  }

  onCreateConcept(concept: any) {
    this.showConceptChildForm = !this.showConceptChildForm;
  }

  onCreateQuestionItem(concept: any) {
    this.questionItem = new QuestionItem();
    this.conceptService.getQuestions().subscribe(result => {
      this.allQuestions = result.content;});
    this.showQuestionForm = !this.showQuestionForm;
  }

  select(suggestion: any) {
    this.questionItem.question = suggestion;
  }

  selectResponseDomain(suggestion: any) {
    this.questionItem.responseDomain = suggestion;
  }

  onChildSave() {
    console.log('onChildSave');
    this.showConceptChildForm = false;
    this.conceptService.saveChildConcept(this.newchild, this.concept.id)
        .subscribe(result => {
          this.concept.children.push(result);
    });
    this.newchild  = new Concept();
  }

  onQuestionItemSave() {
    this.showQuestionForm = false;
    this.conceptService.createQuestionItem(this.questionItem)
        .subscribe(result => {
          this.concept.questionItems.push(result);
    });
    this.questionItem  = new QuestionItem();
  }

  removeQuestion(questionItemId:any) {
    this.conceptService.deattachQuestion(this.concept.id, questionItemId)
      .subscribe(result => {
          this.concept = result;
        }
        ,(err) => console.log('ERROR: ', err));
  }
}
