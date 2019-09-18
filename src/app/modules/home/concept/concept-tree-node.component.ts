import { AfterContentChecked, Component, EventEmitter, Input, Output} from '@angular/core';
import {
  ActionKind,
  Concept,
  ElementKind,
  IRevisionRef,
  ElementRevisionRef,
  IElement,
  Page,
  getElementKind, IRevisionResult, QuestionItem, HomeService, MessageService, TemplateService
} from '../../../lib';

import filesaver from 'file-saver';
declare var Materialize: any;

@Component({
  selector: 'qddt-concept-treenode',
  templateUrl: './concept-tree-node.component.html',
  styleUrls: ['./concept-tree-node.component.css']
})

export class TreeNodeComponent implements AfterContentChecked {
  @Input() concept: Concept;
  @Output() deleteEvent =  new EventEmitter();
  @Output() updatedEvent =  new EventEmitter<Concept>();

  public revisionList: IRevisionResult<QuestionItem>[];
  public questionItemList: QuestionItem[];

  public showConceptChildForm = false;
  public showbutton = false;
  public showProgressBar = false;

  public readonly QUESTION_ITEM = ElementKind.QUESTION_ITEM;
  public readonly CONCEPT = ElementKind.CONCEPT;
  public readonly canCreate: boolean;
  public readonly canUpdate: boolean;
  public readonly canDelete: boolean;

  private refreshCount = 0;

  constructor(private homeService: HomeService<Concept>,
              private message: MessageService,  private templateService: TemplateService) {
    this.canCreate = this.homeService.canDo(this.CONCEPT).get(ActionKind.Create);
    this.canUpdate = this.homeService.canDo(this.CONCEPT).get(ActionKind.Update);
    this.canDelete = this.homeService.canDo(this.CONCEPT).get(ActionKind.Delete);
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
      this.concept = await this.homeService.get(this.CONCEPT, this.concept.id);
    }
  }

  onCreateConcept() {
    if (this.canCreate ) {
      this.showConceptChildForm = !this.showConceptChildForm;
    }
  }

  onConceptUpdated(concept: Concept) {
    this.updatedEvent.emit(concept);
  }

  onDeleteConcept(concept: Concept) {
    this.deleteEvent.emit(concept);
  }

  onShowQuestionItem(cqi) {
    this.message.sendMessage( cqi );
  }

  // onSelectRevision(questionItem) {
  //   console.log('select question');
  // }

  onChildSave(newchild) {

    this.showConceptChildForm = false;
    this.concept.children.push(new Concept(newchild));
    this.concept.changeKind = 'UPDATED_HIERARCHY_RELATION';
    this.concept.changeComment = 'ADDED CHILD CONCEPT';
    this.templateService.update<Concept>(this.concept).subscribe(
      (result) => this.concept = result );
  }


  public onSearchElements(search: IElement) {
    this.templateService.searchByKind<QuestionItem>(
      { kind: this.QUESTION_ITEM, key: search.element, page: new Page( { size: 15 } ) } ).then(
      (result) => { this.questionItemList = result.content; },
      (error) => { throw error; } );
  }

  public onRevisonSearch(search: IRevisionRef) {
    const kind = getElementKind(search.elementKind);
    this.templateService.getByKindRevisions<QuestionItem>(kind, search.elementId).then(
      (result) => this.revisionList = result.content);
  }

  // public onSelectChange(event) {
  //   this.currentSequenceKind = event;
  //
  // }
  //
  // public onRevisionSelected(ref: ElementRevisionRef) {
  //   this.sequence.sequence.push(ref);
  // }
  //
  // public onSelectCanceled(value) {
  //   this.selectedElement = null;
  // }

  removeQuestionItem(ref: IRevisionRef) {
    this.homeService.deattachQuestion(this.CONCEPT, this.concept.id, ref.elementId , ref.elementRevision)
      .subscribe(result => this.onConceptUpdated(result) );
  }

  addQuestionItem(ref: ElementRevisionRef) {
    this.homeService.attachQuestion(this.CONCEPT, this.concept.id, ref.elementId, ref.elementRevision)
      .subscribe(result => this.onConceptUpdated(result) );
  }

  getPdf(concept: Concept) {
    const fileName = concept.name + '.pdf';
    this.templateService.getPdf(concept).then(
      (data) => {
        filesaver.saveAs(data, fileName);
      });
  }

  getXml(concept: Concept) {
    const fileName = concept.name + '.xml';
    this.templateService.getXML(concept).then(
      (data) => {
        filesaver.saveAs(data, fileName);
      });
  }

}
