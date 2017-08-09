import { Component, Input, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { ControlConstructService } from '../../../components/controlconstruct/controlconstruct.service';
import * as fileSaver from 'file-saver';
// let fileSaver = require('../../../common/file-saver');

@Component({
  selector: 'qddt-preview-questionconstruct',
  moduleId: module.id,
  styles: [
    '.row { padding-left:5pt !important;}',
  ],
  template: `
  <div class="row" *ngIf="controlConstruct.preInstructions">
    <ul>
      <li>
        <div class="row">
          <label class="teal-text">Pre Instructions</label>
        </div>
      </li>
      <li class="collection-item" *ngFor="let instruction of controlConstruct.preInstructions">
        <div class="row">
          <div class="col">{{instruction?.description}}</div>
        </div>
      </li>
    </ul>
  </div>
  <div class="row">
    <div (click)="onQuestionitemDetail(controlConstruct.questionItem)" [ngStyle]="{'cursor': 'pointer'}">
      <a><i class="material-icons left small">search</i></a>
      <h5>{{controlConstruct?.questionItem?.question?.question}}</h5>
    </div>
  </div>
  <div class="row" *ngIf="controlConstruct.postInstructions">
    <ul>
      <li>
        <div class="row">
          <label class="teal-text">Post Instructions</label>
        </div>
      </li>
      <li class="collection-item" *ngFor="let instruction of controlConstruct.postInstructions">
        <div class="row">
          <div class="col">{{instruction?.description}}</div>
        </div>
      </li>
    </ul>
  </div>
  <div class="row" style="padding-right: 10pt;">
    <qddt-preview-responsedomain
      *ngIf="controlConstruct.questionItem && controlConstruct.questionItem.responseDomain"
      [isVisible]="true" [responseDomain]="controlConstruct.questionItem.responseDomain">
    </qddt-preview-responsedomain>
  </div>
  <div class="row">
    <label class="teal-text">External aid</label>
  </div>
  <div class="row">
    <ul>
      <li *ngFor="let m of controlConstruct.otherMaterials;" class="col s12 m6 l3">
          <a class="waves-effect waves-light" (click)="onDownloadFile(m)">
          <i class="material-icons center smal">description</i> {{m.originalName}}</a>
      </li>
    </ul>
  </div>
  <div class="row">
    <qddt-element-footer [element]="controlConstruct" [type]="'controlconstruct'"></qddt-element-footer>
  </div>  
  <div class="modal modal-fixed-footer" materialize="modal" [materializeActions]="questionItemActions">
    <div class="modal-content">
      <div class="row">
        <h4>Detail</h4>
        <qddt-preview-questionitem
          *ngIf="questionItem" [questionItem]=questionItem>
        </qddt-preview-questionitem>
      </div>
    </div>
    <div class="modal-footer">
      <button
        (click)="false"
        class="btn btn-default red modal-action modal-close waves-effect">
        <a><i class="close material-icons medium white-text">close</i></a>
      </button>
    </div>
  </div>
`,
  providers: [ControlConstructService ],
})

export class PreviewQuestionConstructComponent {
  @Input() controlConstruct: any;
  questionItemActions = new EventEmitter<string|MaterializeAction>();
  questionItem: any;
  constructor(private service: ControlConstructService) {
  }

onDownloadFile(o: any) {
  let fileName = o.originalName;
  this.service.getFile(o.id).subscribe(
    (data: any) => {
      fileSaver(data, fileName);
    },
    error => console.log(error));
}

onQuestionitemDetail(questionItem) {
  this.questionItem = questionItem;
  this.questionItemActions.emit({action:'modal', params:['open']});
}

}
