import { hasChanges } from 'src/app/lib';
import { FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
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

export class QuestionFormComponent implements AfterViewInit, OnChanges {
  @Input() questionItem: QuestionItem;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionItem>();

  public showButton = false;
  public formId = Math.round(Math.random() * 10000);
  public readonly LANGUAGES = LANGUAGE_MAP;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.QUESTION_ITEM);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.questionItem)) {
      this.questionItem = new QuestionItem(changes.questionItem.currentValue)
    }
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
    this.questionItem.responseId = {
      id: item.elementId, rev: item.elementRevision
    }
    this.questionItem._embedded.responseDomain = item.element;
    this.questionItem.responseName = item.element.name
    // this.questionItem.responseDomain = item.element;
  }

  onResponseDomainRemove() {
    // this.ques/tionItem.responseDomainRef = new ElementRevisionRefImpl<ResponseDomain>({ elementKind: ElementKind.RESPONSEDOMAIN });
  }

  onResponseDomainUpdate(element: ResponseDomain, form: FormGroup) {
    element.changeKind = 'CONCEPTUAL';
    element.changeComment = 'Values changed or managed representation added';
    this.service.update<ResponseDomain>(element).subscribe(result => {
      this.questionItem.responseId.rev = 0;
      this.questionItem.responseId.id = result.id;
      this.questionItem._embedded.responseDomain = result;
      // console.debug('rd + rdref updated');
      // this will fetch latest revision of Rd, when QI is saved.
    });
  }
}

