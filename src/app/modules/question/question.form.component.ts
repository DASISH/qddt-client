import { FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {
  ActionKind,
  ElementKind,
  ElementRevisionRefImpl,
  LANGUAGE_MAP,
  QuestionItem,
  ResponseDomain,
  TemplateService
} from '../../lib';


@Component({
  selector: 'qddt-questionitem-form',
  templateUrl: './question.form.component.html'
})

export class QuestionFormComponent implements AfterViewInit {
  @Input() questionItem: QuestionItem;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionItem>();

  public showButton = false;
  public formId = Math.round(Math.random() * 10000);
  public readonly LANGUAGES = LANGUAGE_MAP;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.QUESTION_ITEM);
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
    // if ([].find(p=>p.value)===undefined)
  }

  onSaveQuestionItem() {
    this.service.update<QuestionItem>(this.questionItem)
      .subscribe((result) => {
        this.questionItem = result;
        this.modifiedEvent.emit(this.questionItem);
      });
  }

  onResponseDomainSelected(item: ElementRevisionRefImpl<ResponseDomain>, form: FormGroup) {
    this.questionItem.responseDomainRef = item;
  }

  onResponseDomainRemove() {
    this.questionItem.responseDomainRef = new ElementRevisionRefImpl<ResponseDomain>({ elementKind: ElementKind.RESPONSEDOMAIN });
  }

  onResponseDomainUpdate(element: ResponseDomain, form: FormGroup) {
    element.changeKind = 'CONCEPTUAL';
    element.changeComment = 'Values changed or managed representation added';
    this.service.update<ResponseDomain>(element).subscribe(result => {
      this.questionItem.responseDomainRef.elementRevision = 0;
      this.questionItem.responseDomainRef.elementId = result.id;
      this.questionItem.responseDomainRef.element = result;
      // console.debug('rd + rdref updated');
      // this will fetch latest revision of Rd, when QI is saved.
    });
  }
}

