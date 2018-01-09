import { Component, Input } from '@angular/core';
import { QuestionItem } from '../../question/question.service';

@Component({
  selector: 'qddt-preview-questionitem-grid',
  moduleId: module.id,
  styles: [
    `:host /deep/ .row {
       margin-left: auto;
       margin-right: auto;
       margin-bottom: 2px;
    }`
  ],
  template: `
  <div *ngIf="questionItem" style="color: black">
    <div class="row" *ngIf="questionItem.intent">
      <div class="teal-text" *ngIf="questionItem.intent" style="padding-left: 15pt; padding-bottom: 10pt">Intent</div>
      <div style="padding-left: 15pt;">{{ questionItem.intent }}</div>
    </div>
    <div class="row">
      <div class="col s6" style="padding: 1 pt;">
        <table>
          <thead>
            <tr><th>
              <div class="teal-text">Questions</div>
            </th></tr>
          </thead>
          <tbody >
            <tr><td >{{ questionItem.question }}</td></tr>
            <!--<tr *ngFor="let child of questionItem.question.children">-->
              <!--<td>-->
                <!--{{child.question}}-->
              <!--</td>-->
            <!--</tr>-->
          </tbody>
        </table>
      </div>
      <div class="col s6" *ngIf="questionItem.responseDomain">
        <qddt-preview-rd-scale
          [responseDomain]="questionItem.responseDomain"
          [numOfRows]="questionItem.question.children.length+1">
        </qddt-preview-rd-scale>
      </div>
    </div>
  </div>`,
  providers: [ ],
})

export class PreviewQuestionitemGridComponent {
  @Input() questionItem: QuestionItem;


}
