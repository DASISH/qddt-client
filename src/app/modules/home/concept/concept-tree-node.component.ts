import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionKind,
  Concept,
  ElementKind, ElementRevisionRef,
  HomeService,
  MessageService,
  TemplateService, LANGUAGE_MAP
} from '../../../lib';

@Component({
  selector: 'qddt-concept-treenode',
  styles: [
    'li ul:not(.dropdownmenu) {  margin-left: 2rem; }',
    '.card.section.row { margin-left: -0.6rem; }',
    '.dropdownmenu { top:1rem; position:relative;}',
    'ul:not(.dropdownmenu) > li { counter-increment: item; }',
    'ul {  counter-reset: item;}',
    'ul:not(.dropdownmenu) > li div.card:before { content: counters(item, ".") ". ";  position: absolute;top: 5px;left: 5px;display: block; }',
    'li ul:not(.dropdownmenu) > li div.card:before { content: counters(item, ".") " "; }',
  ],
  templateUrl: './concept-tree-node.component.html',
})
// 'h5 .row > div:before { content: counters(item, ".") " "; counter-increment: item }',
// 'h5 .row { counter-reset: item; }'

export class TreeNodeComponent {
  @Input() concepts: Concept[];
  @Output() deleteEvent = new EventEmitter();
  @Output() updatedEvent = new EventEmitter<Concept>();

  public showButton = false;
  public showProgressBar = false;

  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly QUESTION_ITEM = ElementKind.QUESTION_ITEM;
  public readonly CONCEPT = ElementKind.CONCEPT;

  public readonly canCreate: boolean;
  public readonly canUpdate: boolean;
  public readonly canDelete: boolean;

  public readonly trackByIndex = (index: number, entity) => entity.id;


  constructor(private homeService: HomeService<Concept>, private router: Router,
    private message: MessageService, private templateService: TemplateService) {
    this.canCreate = this.homeService.canDo(this.CONCEPT).get(ActionKind.Create);
    this.canUpdate = this.homeService.canDo(this.CONCEPT).get(ActionKind.Update);
    this.canDelete = this.homeService.canDo(this.CONCEPT).get(ActionKind.Delete);
  }

  async onToggleEdit(edit) {
    edit.isVisible = !edit.isVisible;
  }

  onConceptUpdated(concept: Concept) {
    this.updatedEvent.emit(concept);
  }

  onDeleteConcept(concept: Concept) {
    this.deleteEvent.emit(concept);
  }

  onChildSave(newConcept: Concept, parent: Concept) {
    this.showProgressBar = true;
    this.templateService.create(new Concept(newConcept), parent.id).subscribe(
      (result) => {
        parent.children.push(result);
        this.onConceptUpdated(result);
      },
      (error) => { throw error; },
      () => { this.showProgressBar = false; });

  }


  public onQuestionItemRemoved(ref: ElementRevisionRef, conceptId) {
    this.homeService.deattachQuestion(this.CONCEPT, conceptId, ref.elementId, ref.elementRevision)
      .subscribe(result => this.onConceptUpdated(result));
  }

  public onQuestionItemAdded(ref: ElementRevisionRef, conceptId) {
    this.homeService.attachQuestion(this.CONCEPT, conceptId, ref.elementId, ref.elementRevision)
      .subscribe(result => this.onConceptUpdated(result));
  }

  public onQuestionItemModified(ref: ElementRevisionRef, concept: Concept) {
    console.log('onItemModified -> ' + ref || JSON);
    const idx = concept.conceptQuestionItems.findIndex(f => f.elementId === ref.elementId);
    const seqNew: ElementRevisionRef[] = [].concat(
      concept.conceptQuestionItems.slice(0, idx),
      ref,
      concept.conceptQuestionItems.slice(idx + 1)
    );
    concept.conceptQuestionItems = seqNew;

    this.templateService.update<Concept>(concept).subscribe(
      (result) => concept = result);
  }

}
