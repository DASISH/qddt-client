import { Component, Input } from '@angular/core';


@Component({
  selector: 'qddt-preview-questionitems',
  moduleId: module.id,
  styles: [  ],
  template: `
<!--<div *ngIf="questionItems.length > 0" class="section">-->
  <!--<ul class="collection with-header hoverable"-->
    <!--(mouseenter)="showbutton = true"-->
    <!--(mouseleave)="showbutton = false">-->
    <!--<li class="collection-header teal-text">Question Items</li>-->
      <!--<a class="collection-item grey-text text-darken-1" *ngFor="let cqi of questionItems">-->
        <!--<div class="row" style="min-height: 3rem;">-->
          <!--<div class="col s11" (click)="onClickQuestionItem(cqi.questionItem)" style="cursor: pointer;">-->
            <!--♦ {{cqi?.questionItem?.question?.question}}</div>-->
          <!--<div class="col s1">-->
            <!--<a-->
              <!--class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"-->
              <!--[ngClass]="{hide: !showbutton}"-->
              <!--(click)="removeQuestionItem(cqi?.questionItem?.id)">-->
              <!--<i class="material-icons" title="Remove selected">remove</i>-->
            <!--</a>-->
          <!--</div>-->
        <!--</div>-->
      <!--</a>-->
  <!--</ul>-->
<!--</div>-->
`
  ,
  providers: [ ],
})

export class PreviewQuestionItemsComponent {
  @Input() questionItems: any;
}
