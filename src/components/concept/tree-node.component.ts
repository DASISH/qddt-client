import { Component, Input} from 'angular2/core';
import {LocalDatePipe} from '../../common/date_pipe';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {ConceptRevision} from './concept_revision.component';
//import {QuestionListComponent} from './question_list.component';
import {ConceptEditComponent} from './edit/concept_edit.component';
import {CommentListComponent} from '../comment/comment_list.component';
import {ConceptService, Concept} from './concept.service';

@Component({
  selector: 'treenode',
  providers: [ConceptService],
  directives: [TreeNodeComponent, MaterializeDirective, ConceptRevision, ConceptEditComponent, CommentListComponent],
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
      <div id="{{concept.name}}" class="scrollspy">
         <div class="col s1 m1 l1">
           <br />
           <div class="row">
             <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                   (click)="edit.isVisible = !edit.isVisible"><i class="material-icons">mode_edit</i></a>
             <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
                   (click)="revision.isVisible = !revision.isVisible"><i class="material-icons left medium">history</i></a>
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
           <concept-revision [isVisible]="revision.isVisible" [conceptId]="concept.id" #revision ></concept-revision>
           <div class="row">
             <comment-list [ownerId]="concept.id"></comment-list>
           </div>
           <div class="tree-children">
             <treenode *ngFor="#child of concept.children" [concept]="child"></treenode>
           </div>
    </div></div></div>
  `
})

export class TreeNodeComponent {
  @Input() concept: any;
  showConceptChildForm: boolean = false;
  private newchild: any;

  constructor(private conceptService: ConceptService) {
    this.newchild = new Concept();
  }

  onCreateConcept(concept: any) {
    this.showConceptChildForm = !this.showConceptChildForm;
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
}
