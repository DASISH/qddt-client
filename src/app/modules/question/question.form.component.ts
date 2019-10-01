import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import {
  ActionKind,
  Category,
  ElementKind,
  ElementRevisionRef,
  IElement,
  makeMixed,
  QuestionItem,
  ResponseDomain,
  TemplateService
} from '../../lib';

declare var Materialize: any;

@Component({
  selector: 'qddt-questionitem-form',

  styles: [
    ':host ::ng-deep .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  templateUrl: './question.form.component.html'
})

export class QuestionFormComponent  implements OnChanges {
  @Input() questionItem: QuestionItem;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionItem>();

  public showbutton = false;
  public formId = Math.round( Math.random() * 10000);
  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.QUESTION_ITEM);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionItem'].currentValue) {
      console.log('new questionItem');
    }
    try { Materialize.updateTextFields(); } catch (Exception) { }
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
      this.service.update(item.element).subscribe(result => {
        item.element = result;
        this.questionItem.responseDomain = item.element;
        this.questionItem.responseDomainRevision = 0;
      });
    } else {
      this.questionItem.responseDomain = item.element;
      this.questionItem.responseDomainRevision = item.elementRevision || 0;

    }
  }

  onResponsedomainRemove() {
    this.questionItem.responseDomainRevision = 0;
    this.questionItem.responseDomain = null;
  }


  private setMissing(missing: Category) {
    let rd = new ResponseDomain(this.questionItem.responseDomain);
    if (!rd.isMixed()) {
      rd = makeMixed(rd);
    }
    rd.addManagedRep(missing);
    rd.name = rd.managedRepresentation.name = 'Mixed [' + rd.name + '+' + missing.name + ']';
    this.questionItem.responseDomain = rd;
  }

  public getMissing(): Category {
    return  new ResponseDomain(this.questionItem.responseDomain).getMissing();
  }

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
