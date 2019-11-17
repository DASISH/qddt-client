import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionKind,
  Concept,
  ElementKind, ElementRevisionRef,
  HomeService,
  IRevisionResult,
  MessageService,
  QuestionItem, TemplateService
} from '../../../lib';

@Component({
  selector: 'qddt-concept-treenode',
  templateUrl: './concept-tree-node.component.html',
  styleUrls: ['./concept-tree-node.component.css']
})

export class TreeNodeComponent {
  @Input() concept: Concept;
  @Output() deleteEvent = new EventEmitter();
  @Output() updatedEvent = new EventEmitter<Concept>();

  public revisionList: IRevisionResult<QuestionItem>[];
  public questionItemList: QuestionItem[];

  public showConceptChildForm = false;
  public showButton = false;
  public showProgressBar = false;

  public readonly QUESTION_ITEM = ElementKind.QUESTION_ITEM;
  public readonly CONCEPT = ElementKind.CONCEPT;
  public readonly canCreate: boolean;
  public readonly canUpdate: boolean;
  public readonly canDelete: boolean;

  private refreshCount = 0;

  constructor(private homeService: HomeService<Concept>, private router: Router,
    private message: MessageService, private templateService: TemplateService) {
    this.canCreate = this.homeService.canDo(this.CONCEPT).get(ActionKind.Create);
    this.canUpdate = this.homeService.canDo(this.CONCEPT).get(ActionKind.Update);
    this.canDelete = this.homeService.canDo(this.CONCEPT).get(ActionKind.Delete);
  }

  async onToggleEdit(edit) {
    edit.isVisible = !edit.isVisible;
    if (edit.isVisible) {
      this.refreshCount = 0;
      this.concept = await this.homeService.get(this.CONCEPT, this.concept.id);
    }
  }

  onCreateConcept() {
    if (this.canCreate) {
      this.showConceptChildForm = !this.showConceptChildForm;
    }
  }

  onConceptUpdated(concept: Concept) {
    this.updatedEvent.emit(concept);
  }

  onDeleteConcept(concept: Concept) {
    this.deleteEvent.emit(concept);
  }

  onChildSave(newchild) {
    this.showConceptChildForm = false;
    this.concept.children.push(new Concept(newchild));
    this.concept.changeKind = 'UPDATED_HIERARCHY_RELATION';
    this.concept.changeComment = 'ADDED CHILD CONCEPT';
    this.templateService.update<Concept>(this.concept).subscribe(
      (result) => this.concept = result);
  }

  public onQuestionItemRemoved(ref: ElementRevisionRef, conceptId) {
    this.homeService.deattachQuestion(this.CONCEPT, conceptId, ref.elementId, ref.elementRevision)
      .subscribe(result => this.onConceptUpdated(result));
  }

  public onQuestionItemAdded(ref: ElementRevisionRef, conceptId) {
    this.homeService.attachQuestion(this.CONCEPT, conceptId, ref.elementId, ref.elementRevision)
      .subscribe(result => this.onConceptUpdated(result));
  }

  public onQuestionItemModified(ref: ElementRevisionRef, conceptId) {
    console.log(ref || JSON);
    // this.homeService.attachQuestion(this.CONCEPT, conceptId, ref.elementId, ref.elementRevision)
    // .subscribe(result => this.onConceptUpdated(result) );
  }

}
