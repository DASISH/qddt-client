import {Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {ActionKind, ElementKind, ElementRevisionRef, LANGUAGE_MAP, QuestionItem, ResponseDomain, TemplateService} from '../../lib';


@Component({
  selector: 'qddt-questionitem-form',
  templateUrl: './question.form.component.html'
})

export class QuestionFormComponent  implements AfterViewInit {
  @Input() questionItem: QuestionItem;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionItem>();

  public showButton = false;
  public formId = Math.round( Math.random() * 10000);
  public readonly LANGUAGES = LANGUAGE_MAP;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.QUESTION_ITEM);
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  onSaveQuestionItem() {
    console.log('QI no managed rep saving...');
    this.service.update<QuestionItem>(this.questionItem)
      .subscribe((result) => {
        this.questionItem = result;
        this.modifiedEvent.emit(this.questionItem);
      });
  }

  onSaveResponseDomain(item: ElementRevisionRef) {
    if (item.element.responseKind === 'MIXED') {
      this.onUpdateResponseDomain(item.element as ResponseDomain);
    } else {
      this.questionItem.responseDomain = item.element;
      this.questionItem.responseDomainRevision = item.elementRevision || 0;
    }
  }

  onResponseDomainRemove() {
    this.questionItem.responseDomainRevision = 0;
    this.questionItem.responseDomain = null;
  }

  onUpdateResponseDomain(element: ResponseDomain) {
    element.changeKind = 'CONCEPTUAL';
    element.changeComment = 'Values changed or managed representation added';
    this.service.update(element).subscribe(result => {
      this.questionItem.responseDomain = result as ResponseDomain;
      this.questionItem.responseDomainRevision = 0;
    });
  }
}
