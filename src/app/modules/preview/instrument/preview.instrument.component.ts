import { Component, Input } from '@angular/core';
import { ElementRevisionRef, Instrument } from '../../../lib/classes';
import { MessageService, PreviewService } from '../../../lib/services';

@Component({
  selector: 'qddt-preview-instrument',
  template: `
  <div class="row">
    <div class="col s12">
      <textarea class="materialize-textarea" [id]="instrument?.id+ '-desc'"readonly>
      </textarea>
      <label class="teal-text">Description</label>
    </div>
  </div>
  <ul *ngIf="instrument.root.children"s class="collapsible" data-collapsible="accordion" style="margin:25px; padding:10px;">
    <li *ngFor="let cc of instrument.root.children"  (click)="onViewDetail(cc)" >
      <div class="collapsible-header yellow lighten-5">
        <div class="col l10">{{ cc?.name }}</div>
        <div class="col l2">
          <qddt-version-label [element]="cc"></qddt-version-label>
        </div>
      </div>
      <div class="collapsible-body">
        <qddt-preview-controlconstruct [construct]="cc.element" [inParameters]="instrument.parameters.entries()">
        </qddt-preview-controlconstruct>
      </div>
    </li>
  </ul>
  <div class="row">
    <qddt-comment-list [ownerId]="instrument.id" [comments]="instrument.comments"></qddt-comment-list>
  </div>
  <div class="row">
    <qddt-element-footer [element]="instrument"></qddt-element-footer>
  </div>`
  ,
})

export class PreviewInstrumentComponent {
  @Input() instrument: Instrument;

  constructor(private message: MessageService, private service: PreviewService) { }

  onViewDetail(element: ElementRevisionRef) {
    if (!element.element) {
      this.service.getRevisionByKind(element.elementKind, element.elementId, element.elementRevision).then(
        (result) => { element.element = result.entity; },
        (error) => { throw error; });
    }
  }
}
