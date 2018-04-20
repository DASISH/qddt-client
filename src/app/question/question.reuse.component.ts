import { Component, Output, EventEmitter, Input } from '@angular/core';
import { TemplateService } from '../template/template.service';
import { QuestionItem } from './question.classes';
import { Page, ElementRevisionRef } from '../shared/classes/classes';
import { ElementKind } from '../shared/classes/enums';
import { IElement, IRevisionRef } from '../shared/classes/interfaces';

@Component({
  selector: 'qddt-questionitem-reuse',
  moduleId: module.id,
  templateUrl: './question.reuse.component.html',
})

export class QuestionReuseComponent {
  @Input() parentId: string;
  @Input() name: string;
  @Output() createdEvent = new EventEmitter<ElementRevisionRef>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  closeReuseActions = new EventEmitter<any>();

  public readonly QUESTION = ElementKind.QUESTION_ITEM;
  public showProgressBar = false;

  public questionList: QuestionItem[];
  public revisionResults: any[];

  constructor(private service: TemplateService) {  }

  onRevisionSelect(ref: ElementRevisionRef) {
    this.createdEvent.emit(ref);
    this.closeReuseActions.emit({action: 'modal', params: ['close']});
  }

  onRevisonSearch(ref: IRevisionRef) {
    this.showProgressBar = true;
    this.service.getRevisionsByKind( this.QUESTION, ref.elementId).then(
      (result) => { this.revisionResults =
        result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
        this.showProgressBar = false;
      } );
  }

  onQuestionSearch(ref: IElement) {
    this.showProgressBar = true;
    this.service.searchByKind<QuestionItem>( { kind: this.QUESTION, key: ref.element, page: new Page() } ).then(
      (result) => { this.questionList = result.content; this.showProgressBar = false;
    });
  }

  onDismiss() {
    this.dismissEvent.emit(true);
    this.closeReuseActions.emit({action: 'modal', params: ['close']});
  }

  openModal() {
    this.closeReuseActions.emit({action: 'modal', params: ['open']});
    this.onQuestionSearch( { element: '*', elementKind: this.QUESTION });
  }



}
