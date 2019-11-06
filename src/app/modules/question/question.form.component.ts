import {Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {
  ActionKind,
  ElementKind,
  ElementRevisionRef,
  QuestionItem,
  ResponseDomain,
  TemplateService
} from '../../lib';


@Component({
  selector: 'qddt-questionitem-form',

  styles: [
    // ':host .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  templateUrl: './question.form.component.html'
})

export class QuestionFormComponent  implements AfterViewInit {
  @Input() questionItem: QuestionItem;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionItem>();

  public showbutton = false;
  public formId = Math.round( Math.random() * 10000);

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.QUESTION_ITEM);
  }

  ngAfterViewInit(): void {
    // document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
    //   input => M.CharacterCounter.init(input));
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
      const element = item.element as ResponseDomain;
      element.changeKind = 'CONCEPTUAL';
      element.changeComment = 'Values changed or managed representation added';
      this.service.update(element).subscribe(result => {
        item.element = result;
        this.questionItem.responseDomain = item.element;
        this.questionItem.responseDomainRevision = 0;
      });
    } else {
      this.questionItem.responseDomain = item.element;
      this.questionItem.responseDomainRevision = item.elementRevision || 0;
    }
  }

  // onSaveMissingResponseDomain(item: ResponseDomain) {
  //   item.changeKind = 'CONCEPTUAL';
  //   item.changeComment = 'Values changed or managed representation added';
  //   this.service.update<ResponseDomain>(item).subscribe(result => {
  //     this.questionItem.responseDomain = result;
  //     this.questionItem.responseDomainRevision = 0;
  //   });
  //   console.log(this.questionItem.responseDomain);
  // }

  onResponsedomainRemove() {
    this.questionItem.responseDomainRevision = 0;
    this.questionItem.responseDomain = null;
  }

  // public getMissing(): Category {
  //   return  new ResponseDomain(this.questionItem.responseDomain).missing;
  // }

  // onOpenModal() {
  //   $('#unique01').modal('open');
  //   // $('#unique02').modal('open');
  //   // this.deleteAction.emit({action: 'modal', params: ['open']});
  // }

  // private deleteChild(representation: Category, categoryType: string) {
  //   if (!representation.children) {
  //     return;
  //   }
  //   const index = representation.children.findIndex((e: any) => e.categoryType === categoryType);
  //   if (index >= 0) {
  //     representation.children.splice(index, 1);
  //   }
  // }

}
