import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ConceptService, Concept } from './concept.service';
import { MaterializeAction } from 'angular2-materialize';
let saveAs = require('file-saver');

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
    ':host /deep/ .collection-item .row { min-height:3rem; margin-bottom:0px;border-bottom: none;}',
    '.collection .collection-item {border-bottom: none; }',
    '.collection.with-header .collection-header {border-bottom: none; padding: 0px;}',
    '.collection {border:none; }'],

})

export class TreeNodeComponent {
  @Output() deleteConceptEvent: EventEmitter<any> = new EventEmitter();
  @Output() conceptUpdatedAction:EventEmitter<any> = new EventEmitter();
  @Input() concept: any;
  @Input() readonly :boolean;
  showConceptChildForm: boolean = false;
  showQuestionForm: boolean = false;
  questionItemActions = new EventEmitter<string|MaterializeAction>();
  private showbutton: boolean = false;
  private newchild: any;
  private questionItem: any;

  constructor(private conceptService: ConceptService) {
    this.newchild = new Concept();
  }

  onCreateConcept(concept: any) {
    if (!this.readonly)
      this.readonly = concept.archived;
    this.showConceptChildForm = !this.showConceptChildForm;
  }

  onConceptSavedEvent(concept: any) {
    this.concept.version = concept.version;
    this.conceptUpdatedAction.emit(concept);
    // this.concept.workinprogress = (concept.version.versionLabel === 'In Development');
  }

  onConceptUpdated(concept:any) {
    this.conceptUpdatedAction.emit(concept);
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
        this.onConceptSavedEvent(result);
      }, (error: any) => console.log(error));
  }

  removeQuestionItem(questionItem: any) {
    this.conceptService.deattachQuestion(this.concept.id, questionItem)
      .subscribe((result: any) => {
        this.concept = result;
          this.onConceptSavedEvent(result);
        }
      , (err: any) => console.log('ERROR: ', err));
  }

  setQuestionItem(questionItem: any) {
      this.conceptService.attachQuestion(this.concept.id,questionItem.id,questionItem['questionItemRevision'])
        .subscribe((result: any) => {
          this.concept = result;
          this.onConceptSavedEvent(result);
        }, (error: any) => console.log(error));
  }

  getPdf(concept: Concept) {
    let fileName = concept.name + '.pdf';
    this.conceptService.getPdf(concept.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
      },
      error => console.log(error));
  }
}
