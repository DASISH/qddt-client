import { Component, ViewChild } from '@angular/core';
import { QuestionService, QuestionItem } from './question.service';
import { Category } from '../category/category.service';
import { ResponseDomain } from '../responsedomain/responsedomain.service';
import { TemplateComponent } from '../template/template.component';

@Component({
  selector: 'qddt-questionitem',
  moduleId: module.id,
  templateUrl: './question.component.html',
  styles: [':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'],
})

export class QuestionComponent {
  @ViewChild(TemplateComponent) rootCmp: TemplateComponent;

  public questionItem =  new QuestionItem();
  private showbutton = false;

  constructor(private service: QuestionService) {
    console.log('QuestionItemEditComponent:: CSTOR');
   }


  onSaveQuestionItem() {
    if ((this.questionItem.responseDomain) && (!this.questionItem.responseDomain.id)) {
      this.service.createResponseDomain(this.questionItem.responseDomain)
        .subscribe(result => {
          this.questionItem.responseDomain = result;
          this.questionItem.responseDomainRevision = 0;
          this.service.updateQuestionItem(this.questionItem)
            .subscribe((result1: any) => {
              this.rootCmp.onToggleForm();
              this.questionItem = new QuestionItem();
            });
        });
    } else {
      this.service.updateQuestionItem(this.questionItem)
        .subscribe((result) => {
          this.questionItem = new QuestionItem();
          this.rootCmp.onToggleForm();
        });
    }
  }

  onResponseDomainSelected(item: QuestionItem) {
    if (item.responseDomain.responseKind === 'MIXED') {
      this.service.createResponseDomain(item.responseDomain).subscribe(result => {
        this.questionItem.responseDomain = result;
        this.questionItem.responseDomainRevision = 0;
        console.log('RD saved');
      });
    } else {
        this.questionItem.responseDomain = item.responseDomain;
        this.questionItem.responseDomainRevision = item.responseDomainRevision || 0;
      }
   }

  onResponsedomainRemove(item: any) {
    this.questionItem.responseDomainRevision = 0;
    this.questionItem.responseDomain = null;
  }

  private isMixed(): boolean {
    if (this.questionItem.responseDomain) {
      return this.questionItem.responseDomain.responseKind === 'MIXED';
    }
    return false;
  }

  private setMissing(missing: Category) {
    let rd = this.questionItem.responseDomain;
    if (this.isMixed()) {                                                   // remove existing missing
      this.deleteChild(rd.managedRepresentation, 'MISSING_GROUP');
    } else {                                                                // no mixed, create one.
      rd = this.newMixedResponseDomain();
    }
    rd.managedRepresentation.children.push(missing);
    rd.name = rd.managedRepresentation.name = 'Mixed [' + this.getManagedRepresentation().name + '+' + missing.name + ']';
    this.questionItem.responseDomain = rd;
  }

  private getMissing(): Category {
    return  this.questionItem.responseDomain.managedRepresentation.children.find(e => e.categoryType === 'MISSING_GROUP');
  }

  private newMixedResponseDomain(): ResponseDomain {
    const rd: any = {
      responseKind: 'MIXED',
      description : '',
      name: '',
      displayLayout: (this.questionItem.responseDomain.displayLayout) ? this.questionItem.responseDomain.displayLayout : 0,
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
    const rep = this.questionItem.responseDomain.managedRepresentation;
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
