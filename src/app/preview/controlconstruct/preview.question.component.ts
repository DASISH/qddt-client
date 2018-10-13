import { Component, Input } from '@angular/core';
import { PreviewService } from '../preview.service';
import { Router } from '@angular/router';
import { IOtherMaterial } from '../../shared/classes/interfaces';
import { QuestionConstruct } from '../../controlconstruct/controlconstruct.classes';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-preview-questionconstruct',
  moduleId: module.id,
  styles: [ ],
  template: `
  <div class="row" *ngIf="controlConstruct.preInstructions?.length>0">
    <ul>
      <li>
        <div class="row">
          <label>Pre Instructions</label>
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
    <h5 [innerHtml]="controlConstruct?.questionItem?.question" ></h5>
  </div>
  <div class="row" *ngIf="controlConstruct.postInstructions?.length>0">
    <ul>
      <li>
        <div class="row">
          <label>Post Instructions</label>
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
  <div class="row" *ngIf="showDetail">
    <qddt-element-footer [element]="controlConstruct"></qddt-element-footer>
  </div>
`,
})

export class PreviewQuestionConstructComponent {
  @Input() controlConstruct: QuestionConstruct;
  @Input() showDetail = true;
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
