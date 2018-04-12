import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { QuestionItem, QuestionService } from './question.service';
import { Category } from '../category/category.service';
import { ResponseDomain } from '../responsedomain/responsedomain.service';
import { TemplateService } from '../template/template.service';
import { ElementKind } from '../shared/elementinterfaces/elements';

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

  onResponseDomainSelected(item: QuestionItem) {
    if (item.responseDomain.responseKind === 'MIXED') {
      this.service.update(item.responseDomain).subscribe(result => {
        this.questionitem.responseDomain = result;
        this.questionitem.responseDomainRevision = 0;
        console.log('RD saved');
      });
    } else {
        this.questionitem.responseDomain = item.responseDomain;
        this.questionitem.responseDomainRevision = item.responseDomainRevision || 0;
      }
   }

  onResponsedomainRemove(item: any) {
    this.questionitem.responseDomainRevision = 0;
    this.questionitem.responseDomain = null;
  }

  private isMixed(): boolean {
    if (this.questionitem.responseDomain) {
      return this.questionitem.responseDomain.responseKind === 'MIXED';
    }
    return false;
  }

  private setMissing(missing: Category) {
    let rd = this.questionitem.responseDomain;
    if (this.isMixed()) {                                                   // remove existing missing
      this.deleteChild(rd.managedRepresentation, 'MISSING_GROUP');
    } else {                                                                // no mixed, create one.
      rd = this.newMixedResponseDomain();
    }
    rd.managedRepresentation.children.push(missing);
    rd.name = rd.managedRepresentation.name = 'Mixed [' + this.getManagedRepresentation().name + '+' + missing.name + ']';
    this.questionitem.responseDomain = rd;
  }

  private getMissing(): Category {
    return  this.questionitem.responseDomain.managedRepresentation.children.find(e => e.categoryType === 'MISSING_GROUP');
  }

  private newMixedResponseDomain(): ResponseDomain {
    const rd: any = {
      responseKind: 'MIXED',
      description : '',
      name: '',
      displayLayout: (this.questionitem.responseDomain.displayLayout) ? this.questionitem.responseDomain.displayLayout : 0,
      managedRepresentation : {
        name: '',
        label: '',
        description: '[Mixed] group - ',
        inputLimit:  {minimum: 0 , maximum: 1},
        hierarchyLevel: 'GROUP_ENTITY',
        categoryType: 'MIXED',
        children: [this.getManagedRepresentation()]
      }};
    return rd;
    }

  private getManagedRepresentation(): any {
    const rep = this.questionitem.responseDomain.managedRepresentation;
    if (rep) {
      if (rep.categoryType === 'MIXED') {
        return rep.children.find(c => c.categoryType !== 'MISSING_GROUP');
      } else {
        return rep;
      }
    }
    return null;
  }

  private deleteChild(representation: Category, categoryType: string) {
    if (!representation.children) {
      return;
    }
    const index = representation.children.findIndex((e: any) => e.categoryType === categoryType);
    if (index >= 0) {
      representation.children.splice(index, 1);
    }
  }



}
