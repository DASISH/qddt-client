import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { QuestionItem, QuestionService } from './question.service';
import { MaterializeAction } from 'angular2-materialize';
import { Category } from '../category/category.service';
import { ResponseDomain } from '../responsedomain/responsedomain.service';

@Component({
  selector: 'qddt-questionitem-edit',
  moduleId: module.id,
  providers: [QuestionService],
  styles:[
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  templateUrl:'./question.edit.component.html'
})

export class QuestionItemEditComponent implements OnInit {
  @Input() questionitem: QuestionItem;
  @Input() isVisible: boolean;
  @Input() readonly: boolean;
  @Output() editQuestionItem: EventEmitter<any>;

  showbutton: any;
  basedonActions = new EventEmitter<string|MaterializeAction>();
  basedonObject: any;

  constructor(private service: QuestionService) {
    this.editQuestionItem = new EventEmitter<any>();
    this.showbutton = false;
  }

  ngOnInit() {
    if(!this.readonly) {
      this.readonly = false;
    }
  }

  onSaveQuestionItem() {
    if((this.questionitem.responseDomain) && (!this.questionitem.responseDomain.id))
      this.service.createCategory(this.questionitem.responseDomain.managedRepresentation)
        .subscribe(result => {
          this.questionitem.responseDomain.managedRepresentation = result;
          this.service.createResponseDomain(this.questionitem.responseDomain)
            .subscribe(result => {
              this.questionitem.responseDomain = result;
              this.questionitem.responseDomainRevision =0;
              this.service.updateQuestionItem(this.questionitem)
                .subscribe((result: any) => {
                  this.questionitem = result;
                  this.editQuestionItem.emit(this.questionitem);
                });
            });
        });
    else {
      this.service.updateQuestionItem(this.questionitem)
        .subscribe((result: any) => {
          this.questionitem = result;
          this.editQuestionItem.emit(this.questionitem);
        });
    }
    this.isVisible = false;
  }

  onBasedonObjectDetail(ref:any) {
    if (!ref.rev)
      ref.rev=0;
    this.service.getQuestionItemRevision(ref.id,ref.rev)
      .subscribe(
      (result: any) => {
        this.basedonObject = result.entity;
        this.basedonActions.emit({action:'modal', params:['open']});
      },
      (err: any) => null
      );
  }

  onResponseDomainSelected(item: any) {
    this.questionitem.responseDomain = item.responseDomain;
    this.questionitem.responseDomainRevision = item.responseDomainRevision || 0;
   }

  onResponsedomainRemove(item: any) {
    console.log('onResponsedomainRemove');
    this.questionitem.responseDomainRevision = 0;
    this.questionitem.responseDomain = null;
  }

  private isMixed(): boolean {
    if (this.questionitem.responseDomain)
      return this.questionitem.responseDomain.responseKind === 'MIXED';
    return false;
  }

  private setMissing(missing: Category) {
    let rd = this.questionitem.responseDomain;
    if (this.isMixed()) {                                                   //remove existing missing
      this.deleteChild(rd.managedRepresentation,'MISSING_GROUP');
    } else {                                                                // no mixed, create one.
      rd = this.newMixedResponseDomain();
    }
    rd.managedRepresentation.children.push(missing);
    rd.name = rd.managedRepresentation.name = 'Mixed [' + this.getManagedRedresentation().name + '+' + missing.name +']';
    this.questionitem.responseDomain = rd;
  }

  private getMissing(): Category {
    return  this.questionitem.responseDomain.managedRepresentation.children.find(e => e.categoryType === 'MISSING_GROUP');
  }

  private newMixedResponseDomain(): ResponseDomain {
    let rd: any = {
      responseKind:'MIXED',
      description :'',
      name:'',
      displayLayout: (this.questionitem.responseDomain.displayLayout)? this.questionitem.responseDomain.displayLayout:0,
      managedRepresentation : {
        name: '',
        label: '',
        description: '[Mixed] group - ',
        inputLimit:  {minimum: 0 ,maximum:1},
        hierarchyLevel: 'GROUP_ENTITY',
        categoryType: 'MIXED',
        children: [this.getManagedRedresentation()]
      }};
    return rd;
    }

  private getManagedRedresentation(): any {
    let rep = this.questionitem.responseDomain.managedRepresentation;
    if (rep) {
      if (rep.categoryType === 'MIXED') {
        return rep.children.find(c=>c.categoryType !=='MISSING_GROUP');
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
    let index = representation.children.findIndex((e: any) => e.categoryType === categoryType);
    if (index >= 0) {
      representation.children.splice(index, 1);
    }
  }



}
