import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConceptService, Concept } from '../concept/concept.service';
import { QuestionItem } from './question.service';

@Component({
  selector: 'qddt-questionitem-treenode',
  providers: [ ConceptService ],
  styles: [
    '.tree-children { padding-left: 5px }',
    `.tree-node {
        border-style: solid;
        border-color: green;
    }`
  ],
  moduleId: module.id,
  templateUrl: './question.tree.node.component.html'
})

export class TreeNodeComponent {
  @Output() deleteConceptEvent: EventEmitter<any> = new EventEmitter();
  @Input() concept: any;
  showConceptChildForm: boolean = false;
  showQuestionForm: boolean = false;
  private revisionIsVisible: boolean = false;
  private hideDetail: boolean = false;
  private newchild: any;
  private questionItem: any;

  constructor(private conceptService: ConceptService) {
    this.newchild = new Concept();
  }

  onCreateConcept(concept: any) {
    this.showConceptChildForm = !this.showConceptChildForm;
  }

  onDeleteConcept(concept: any) {
    this.deleteConceptEvent.emit(concept);
  }

  onCreateQuestionItem(concept: any) {
    this.questionItem = new QuestionItem();
    this.showQuestionForm = !this.showQuestionForm;
  }

  select(suggestion: any) {
    this.questionItem.question = suggestion;
  }

  selectResponseDomain(suggestion: any) {
    this.questionItem.responseDomain = suggestion;
  }

  onChildSave() {
    this.showConceptChildForm = false;
    this.conceptService.saveChildConcept(this.newchild, this.concept.id)
      .subscribe((result: any) => {
        this.concept.children.push(result);
      });
    this.newchild = new Concept();
  }

  onQuestionItemSave() {
    this.showQuestionForm = false;
    this.concept.conceptQuestionItems.push(this.questionItem);
    this.conceptService.updateConcept(this.concept)
      .subscribe((result: any) => {
        this.concept = result;
      });
    this.questionItem = new QuestionItem();
  }

  removeQuestionItem(questionItem: any) {
    this.conceptService.deattachQuestion(this.concept.id, questionItem)
      .subscribe((result: any) => {
        this.concept = result;
      }
      , (err: any) => console.log('ERROR: ', err));
  }

  setQuestionItem(questionItem: any) {
    this.concept.conceptQuestionItems.push(questionItem);
    this.conceptService.updateConcept(this.concept)
      .subscribe((result: any) => {
        this.concept = result;
      });
    this.questionItem = new QuestionItem();
  }
}
