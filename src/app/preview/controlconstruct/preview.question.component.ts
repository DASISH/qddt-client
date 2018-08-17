import { Component, Input, EventEmitter } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import {PreviewService} from '../preview.service';
import {Router} from '@angular/router';
import { IOtherMaterial } from '../../shared/classes/interfaces';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-preview-questionconstruct',
  moduleId: module.id,
  styles: [ ],
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
          <div class="col">{{ instruction?.description }}</div>
        </div>
      </li>
    </ul>
  </div>
  <div class="row">
    <div (click)="onQuestionitemDetail(controlConstruct.questionItem)" [ngStyle]="{'cursor': 'pointer'}">
      <a><i class="material-icons left small blue-text" title="go to QuestionItem">help</i></a>
      <h5>{{ controlConstruct?.questionItem?.question }}</h5>
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
          <div class="col">{{ instruction?.description }}</div>
        </div>
      </li>
    </ul>
  </div>
  <div class="row" style="padding-right: 10pt;">
    <qddt-preview-responsedomain
      *ngIf="controlConstruct.questionItem && controlConstruct.questionItem.responseDomain"
      [responseDomain]="controlConstruct.questionItem.responseDomain">
    </qddt-preview-responsedomain>
  </div>
  <div class="row">
    <label class="teal-text">External aid</label>
  </div>
  <div class="row">
    <ul>
      <li *ngFor="let m of controlConstruct.otherMaterials;" class="col s12 m6 l3">
          <a class="waves-effect waves-light" (click)="onDownloadFile(m)">
          <i class="material-icons center smal">description</i> {{ m.originalName }}</a>
      </li>
    </ul>
  </div>
  <div class="row">
    <qddt-element-footer [element]="controlConstruct"></qddt-element-footer>
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
})

export class PreviewQuestionConstructComponent {
  @Input() controlConstruct: any;
  questionItemActions = new EventEmitter<string|MaterializeAction>();
  questionItem: any;

  constructor(private service: PreviewService,  private router: Router) {
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      });
  }

  onQuestionitemDetail(questionItem) {
    this.router.navigate(['/questionitems/', questionItem.id ]);

  }

}
