import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConceptService, Concept } from './concept.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-concept-treenode',
  providers: [ ConceptService ],
  moduleId: module.id,
  templateUrl: './concept.tree.node.component.html',
  styles: [
    '.tree-children { padding-left: 5px }',
    `.tree-node {
        border-style: solid;
        border-color: green;
    }`,
    ':host /deep/ .collection-item .row { min-height:4rem; margin-bottom:0px;}'
  ]
})

export class TreeNodeComponent {
  @Output() deleteConceptEvent: EventEmitter<any> = new EventEmitter();
  @Input() concept: any;
  showConceptChildForm: boolean = false;
  showQuestionForm: boolean = false;
  questionItemActions = new EventEmitter<string|MaterializeAction>();
  private newchild: any;
  private questionItem: any;

  constructor(private conceptService: ConceptService) {
    this.newchild = new Concept();
  }

  onCreateConcept(concept: any) {
    this.showConceptChildForm = !this.showConceptChildForm;
  }

  onConceptSavedEvent(concept: any) {
    this.concept.version = concept.version;
    this.concept.workinprogress = (concept.version.versionLabel === 'In Development');
  }

  onDeleteConcept(concept: any) {
    this.deleteConceptEvent.emit(concept);
  }

  onClickQuestionItem(questionItem) {
    this.questionItem = questionItem;
    this.questionItemActions.emit({action:'modal', params:['open']});
  }

  onChildSave() {
    this.showConceptChildForm = false;
    this.conceptService.saveChildConcept(this.newchild, this.concept.id)
      .subscribe((result: any) => {
        this.concept.children.push(result);
      }, (error: any) => console.log(error));
    this.newchild = new Concept();
  }

  onQuestionItemSave() {
    this.showQuestionForm = false;
    this.concept.conceptQuestionItems.push({'id': {questionItemId: this.questionItem.id, conceptId: this.concept.id}});
    this.conceptService.updateConcept(this.concept)
      .subscribe((result: any) => {
        this.concept = result;
      }, (error: any) => console.log(error));
  }

  removeQuestionItem(questionItem: any) {
    this.conceptService.deattachQuestion(this.concept.id, questionItem)
      .subscribe((result: any) => {
        this.concept = result;
      }
      , (err: any) => console.log('ERROR: ', err));
  }

  setQuestionItem(questionItem: any) {
    // let i = this.concept.conceptQuestionItems.findIndex((q: any) => q['id'] !== undefined
    //   && q['id'] !== null && q['id']['questionItemId'] === questionItem['id']);
    // if (i < 0) {
    //   let questionitem: any = { 'id': { questionItemId: questionItem.id, conceptId: this.concept.id },
    //     'questionItemRevision': questionItem['questionItemRevision']
    //   };
      this.conceptService.attachQuestion(this.concept.id,questionItem.id,questionItem['questionItemRevision'])
        .subscribe((result: any) => {
          this.concept = result;
        }, (error: any) => console.log(error));
  }
}
