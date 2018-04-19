import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { TemplateService } from '../template/template.service';
import { QuestionItem } from './question.classes';
import { Category } from '../category/category.classes';
import { ElementRevisionRef } from '../shared/classes/classes';
import { makeMixed, ResponseDomain} from '../responsedomain/responsedomain.classes';

declare var Materialize: any;

@Component({
  selector: 'qddt-questionitem-form',
  moduleId: module.id,
  styles: [
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  templateUrl: './question.form.component.html'
})

export class QuestionFormComponent  implements OnChanges {
  @Input() questionitem: QuestionItem;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionItem>();

  public showbutton = false;
  public formId = Math.round( Math.random() * 10000);
  constructor(private service: TemplateService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionitem'].currentValue) {
      console.log('new questionitem');
    }
    try { Materialize.updateTextFields(); } catch (Exception) { }
  }

  onSaveQuestionItem() {
    if ((this.questionitem.responseDomain) && (!this.questionitem.responseDomain.id)) {
      this.service.update(this.questionitem.responseDomain)
        .subscribe(result => {
          this.questionitem.responseDomain = result;
          this.questionitem.responseDomainRevision = 0;
          this.service.update(this.questionitem)
            .subscribe((result1: any) => {
              this.questionitem = result1;
              this.modifiedEvent.emit(this.questionitem);
            });
        });
    } else {
      this.service.update(this.questionitem)
        .subscribe((result) => {
          this.questionitem = result;
          this.modifiedEvent.emit(this.questionitem);
        });
    }
  }

  onResponseDomainSelected(item: ElementRevisionRef) {
    console.log(item);
    if (item.element.responseKind === 'MIXED') {
      this.service.update(item.element).subscribe(result => {
        this.questionitem.responseDomain = result;
        this.questionitem.responseDomainRevision = 0;
      });
    } else {
        this.questionitem.responseDomain = item.element;
        this.questionitem.responseDomainRevision = item.elementRevision || 0;

      }
   }

  onResponsedomainRemove() {
    this.questionitem.responseDomainRevision = 0;
    this.questionitem.responseDomain = null;
  }


  private setMissing(missing: Category) {
    let rd = new ResponseDomain(this.questionitem.responseDomain);
    if (!rd.isMixed()) {
      rd = makeMixed(rd);
    }
    rd.addManagedRep(missing);
    rd.name = rd.managedRepresentation.name = 'Mixed [' + rd.name + '+' + missing.name + ']';
    this.questionitem.responseDomain = rd;
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
