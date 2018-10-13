import {Component, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { QuestionItem } from '../../question/question.classes';
import { Concept} from '../home.classes';
import { QddtMessageService } from '../../core/global/message.service';
import { HomeService} from '../home.service';
import { ElementKind, IRevisionRef } from '../../shared/classes';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-concept-treenode',
  providers: [  ],
  moduleId: module.id,
  templateUrl: './concept-tree-node.component.html',
  styleUrls: ['./concept-tree-node.component.css']
})

export class TreeNodeComponent implements AfterContentChecked {
  @Input() concept: any;
  @Input() readonly = false;
  @Output() deleteEvent =  new EventEmitter();
  @Output() updatedEvent =  new EventEmitter();

  public showConceptChildForm = false;
  public showbutton = false;
  public newchild: any;

  private refreshCount = 0;

  constructor(private conceptService: HomeService, private message: QddtMessageService) {
    this.newchild = new Concept();
  }

  ngAfterContentChecked(): void {
    if (this.refreshCount < 10) {
      try {
        this.refreshCount++;
        Materialize.updateTextFields();
      } catch (Exception) {}
    }
  }

  onToggleEdit(edit) {
    edit.isVisible = !edit.isVisible;
    if (edit.isVisible) {
      this.refreshCount = 0;
      this.conceptService.getConcept(this.concept.id).then(
        (result) => { this.concept = result; },
        (error) => { throw error; }
      );
    }
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

  removeQuestionItem(ref: IRevisionRef) {
    this.conceptService.deattachConceptQuestion(this.concept.id, ref.elementId , ref.elementRevision)
      .subscribe((result: any) => {
          this.onConceptSavedEvent(result);
        });
  }

  addQuestionItem(ref: IRevisionRef) {
      this.conceptService.attachConceptQuestion(this.concept.id, ref.elementId, ref.elementRevision)
        .subscribe((result: any) => {
          this.onConceptSavedEvent(result);
        });
  }

  getPdf(concept: Concept) {
    const fileName = concept.name + '.pdf';
    this.conceptService.getPdf(concept).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  getXml(concept: Concept) {
    const fileName = concept.name + '.xml';
    this.conceptService.getXml(concept).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

}
