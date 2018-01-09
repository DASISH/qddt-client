import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ElementTypeDescription, SequenceService, Sequence } from './sequence.service';

@Component({
  selector: 'qddt-statement-edit',
  moduleId: module.id,
  template: `
  <div class="row teal-text">
    <h5>Statement</h5>
    <div class="input-field row">
      <label [attr.for]="elementId + '-name'">Name</label>
      <textarea id="{{elementId}}-name" name="{{elementId}}-name"
        class="materialize-textarea"
        [(ngModel)]="statement.name" [attr.maxlength]="255"
        required >
      </textarea>
    </div>
    <div class="input-field row">
      <label [attr.for]="elementId + '-text'">Text</label>
      <textarea id="{{elementId}}-text" name="{{elementId}}-text"
        class="materialize-textarea"
        [(ngModel)]="statement.description" [attr.maxlength]="255">
      </textarea>
    </div>
    <button
      (click)="onCreate()"
      class="btn btn-default green modal-action modal-close waves-effect">
      <a><i class="close material-icons medium white-text">create</i></a>
    </button>
  </div>`,
  styles: [
  ],
  providers: [ SequenceService ],
})
export class StatementEditComponent implements OnInit {
  @Output() element: any = new EventEmitter<any>();
  statement: any;
  elementTypeDescription: any = ElementTypeDescription;
  elementId: string;

  constructor(private service: SequenceService) {
  }

  ngOnInit() {
    this.statement = new Sequence();
    this.statement.controlConstructKind = 'STATEMENT_CONSTRUCT';
    this.elementId = new Date().toString();
  }

  onCreate() {
    this.service.create(this.statement)
      .subscribe((result: any) => {
        this.element.emit(result);
      }, (error: any) => null);
    return false;
  }

}
