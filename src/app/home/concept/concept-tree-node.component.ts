import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { QuestionItem } from '../../question/question.service';
import { ElementKind } from '../../shared/elementinterfaces/elements';
import { HomeService, Concept } from '../home.service';
import { QddtMessageService } from '../../core/global/message.service';
const filesaver = require('file-saver');

@Component({
  selector: 'qddt-concept-treenode',
  providers: [  ],
  moduleId: module.id,
  templateUrl: './concept-tree-node.component.html',
  styleUrls: ['./concept-tree-node.component.css']
})

export class TreeNodeComponent  {
  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() updatedEvent: EventEmitter<any> = new EventEmitter();
  @Input() concept: any;
  @Input() readonly = false;

  showConceptChildForm = false;
  //showQuestionForm = false;
  private showbutton = false;
  private newchild: any;
  private questionItem: any;
  //private revision: any;
  private revisionKind = ElementKind.CONCEPT;

  constructor(private conceptService: HomeService, private message: QddtMessageService) {
    this.newchild = new Concept();
  }

  onCreateConcept(concept: any) {
    if (!this.readonly) {
      this.readonly = concept.archived;
    }
    this.showConceptChildForm = !this.showConceptChildForm;
  }

  onConceptSavedEvent(concept: any) {
    this.concept.version = concept.version;
    this.updatedEvent.emit(concept);
  }

  onConceptUpdated(concept: any) {
    this.updatedEvent.emit(concept);
  }

  onDeleteConcept(concept: any) {
    this.deleteEvent.emit(concept);
  }

  onClickQuestionItem(questionItem: QuestionItem) {
    this.message.sendMessage( { element: questionItem, elementKind: ElementKind.QUESTION_ITEM } );
  }

  onChildSave() {
    this.showConceptChildForm = false;
    this.conceptService.createChildConcept(this.newchild, this.concept.id)
      .subscribe((result: any) => {
        this.concept.children.push(result);
      });
    this.newchild = new Concept();
  }

  removeQuestionItem(entityRef: any) {
    this.conceptService.deattachConceptQuestion(this.concept.id, entityRef.id, entityRef.revisionNumber)
      .subscribe((result: any) => {
          this.onConceptSavedEvent(result);
        });
  }

  addQuestionItem(questionItem: any) {
      this.conceptService.attachConceptQuestion(this.concept.id, questionItem.id, questionItem['questionItemRevision'])
        .subscribe((result: any) => {
          this.onConceptSavedEvent(result);
        });
  }

  getPdf(concept: Concept) {
    const fileName = concept.name + '.pdf';
    this.conceptService.getConceptPdf(concept.id).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }
}
