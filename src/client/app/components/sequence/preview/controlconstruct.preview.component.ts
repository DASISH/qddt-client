import { Component, Input } from '@angular/core';

@Component({
  selector: 'qddt-control-construct-preview',
  moduleId: module.id,
  template: `
    <div class="row" *ngIf="controlConstruct">
      <h5>Questoin construct</h5>
      <div class="row">
        <div class="input-field col s12">
          <label [attr.for]="controlConstruct.id + '-name'" class="active">Name</label>
          <textarea [attr.id]="controlConstruct.id + '-name'"
            name="{{controlConstruct.id}}-name" class="materialize-textarea"
            [ngModel]="controlConstruct.name" [attr.maxlength]="255"
            readonly required>
          </textarea>
        </div>
      </div>

      <div class="section">
        <ul class="collection with-header">
          <li class="collection-header">
            <div class="row">
              <div class="row">Pre Instructions</div>
            </div>
          </li>
          <li class="collection-item" *ngFor="let instruction of controlConstruct.preInstructions; let idx=index">
            <div class="row">
              <div class="row">{{instruction?.description}}</div>
            </div>
          </li>
        </ul>
      </div>

      <div class="row card">
        <div class="row">
          <div class="col s10"><h4>Question Text</h4></div>
        </div>
        <div>
          <span>{{controlConstruct?.questionItem?.question?.question}}</span>
        </div>
      </div>

      <div class="section">
        <ul class="collection with-header">
          <li class="collection-header">
            <div class="row">
              <div class="col s11">Post Instructions</div>
            </div>
          </li>
          <li class="collection-item" *ngFor="let instruction of controlConstruct.postInstructions; let idx=index">
            <div class="row">
              <div class="row">{{instruction?.description}}</div>
            </div>
          </li>
        </ul>
      </div>

      <qddt-responsedomain-preview
        *ngIf="controlConstruct.questionItem && controlConstruct.questionItem.responseDomain"
        [isVisible]="true" [responseDomain]="controlConstruct.questionItem.responseDomain">
      </qddt-responsedomain-preview>
    </div>`,
  providers: [ ],
})

export class ControlConstructPreviewComponent {
  @Input() controlConstruct: any;
}
