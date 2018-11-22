import { AfterContentChecked, Component, EventEmitter, Input, Output} from '@angular/core';
import { Concept } from '../../../classes/home.classes';
import { HomeService} from '../home.service';
import { MessageService } from '../../core/services';
import {ActionKind, ElementKind, IRevisionRef} from '../../../classes';
import {QuestionItem} from '../../question/question.classes';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-concept-treenode',
  providers: [  ],
  templateUrl: './concept-tree-node.component.html',
  styleUrls: ['./concept-tree-node.component.css']
})

export class TreeNodeComponent implements AfterContentChecked {
  @Input() concept: Concept;
  @Input() readonly = false;
  @Output() deleteEvent =  new EventEmitter();
  @Output() updatedEvent =  new EventEmitter();

  public showConceptChildForm = false;
  public showbutton = false;
  public newchild: Concept;

  public readonly canCreate = this.homeService.canDo.get(ElementKind.CONCEPT).get(ActionKind.Create);
  public readonly canUpdate = this.homeService.canDo.get(ElementKind.CONCEPT).get(ActionKind.Update);
  public readonly canDelete  = this.homeService.canDo.get(ElementKind.CONCEPT).get(ActionKind.Delete);

  private refreshCount = 0;

  constructor(private homeService: HomeService, private message: MessageService) {
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

  async onToggleEdit(edit) {
    edit.isVisible = !edit.isVisible;
    if (edit.isVisible) {
      this.refreshCount = 0;
      this.concept = await this.homeService.get<Concept>(this.concept.id);
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
    this.concept.children.push(this.newchild);
    this.homeService.update(this.concept)
      .subscribe((result: any) => {
        this.concept = result;
      });
    this.newchild = new Concept();
  }

  removeQuestionItem(ref: IRevisionRef) {
    this.homeService.deattachConceptQuestion(this.concept.id, ref.elementId , ref.elementRevision)
      .subscribe((result: any) => {
          this.onConceptSavedEvent(result);
        });
  }

  addQuestionItem(ref: IRevisionRef) {
      this.homeService.attachConceptQuestion(this.concept.id, ref.elementId, ref.elementRevision)
        .subscribe((result: any) => {
          this.onConceptSavedEvent(result);
        });
  }

  getPdf(concept: Concept) {
    const fileName = concept.name + '.pdf';
    this.homeService.getPdf(concept).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  getXml(concept: Concept) {
    const fileName = concept.name + '.xml';
    this.homeService.getXml(concept).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

}
