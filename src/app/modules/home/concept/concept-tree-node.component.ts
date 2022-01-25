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
    '.card.section.row { margin-left: -0.6rem; }',
    '.dropdownmenu { top:1rem; position:relative;}',
    'ul {  counter-reset: item;}',
    'ul:not(.dropdownmenu) > li { counter-increment: item; }',
    'ul:not(.dropdownmenu) > li div.card:before { content: counters(item, ".") ". ";  position: absolute;top: 5px;left: 5px;display: block; }',
    'li ul:not(.dropdownmenu) > li div.card:before { content: counters(item, ".") " "; }',
    'li ul:not(.dropdownmenu) {  margin-left: 2rem; }',
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

  async onToggleEdit(edit, conceptId) {
    if (!edit.isVisible){
      this.updateNodeById(this.concepts, await this.homeService.get(this.CONCEPT,conceptId ))
    }
    edit.isVisible = !edit.isVisible;
  }

  updateNodeById(children: Concept[], concept: Concept) {
    if ((!children) || children.length == 0)
      return;

    let index = children.findIndex( it => it.id == concept.id)

    if (index >= 0) {
      children[index] = concept
    } else {
      children.forEach(it=>{
         if (it.children) {
          this.updateNodeById(it.children, concept)
         }else{
          this.updateNodeById(it._embedded?.children, concept)
         }
      })
    }
  }


  onConceptUpdated(concept: Concept) {
    this.updatedEvent.emit(concept);
  }

  onDeleteConcept(concept: Concept) {
    this.deleteEvent.emit(concept);
  }

  onChildSave(newConcept: any, parent: Concept) {
    console.debug(newConcept)
    this.showProgressBar = true;
    let href = parent._links.children.href.replace("{?projection}","")
    this.templateService.create(new Concept(newConcept),null, href).subscribe(
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
    this.homeService.attachQuestion(this.CONCEPT, conceptId, ref)
      .subscribe(result => this.onConceptUpdated(result));
  }

  public onQuestionItemModified(ref: ElementRevisionRef, concept: Concept) {
    console.debug('onItemModified -> ' + ref || JSON);
    const idx = concept.questionItems.findIndex(f => f.elementId === ref.elementId);
    const seqNew: ElementRevisionRef[] = [].concat(
      concept.questionItems.slice(0, idx),
      ref,
      concept.questionItems.slice(idx + 1)
    );
    concept.questionItems = seqNew;

    this.templateService.update<Concept>(concept).subscribe(
      (result) => concept = result);
  }

}
