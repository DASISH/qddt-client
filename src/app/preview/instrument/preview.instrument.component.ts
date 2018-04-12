import { Component, Input } from '@angular/core';
import { Instrument } from '../../instrument/instrument.classes';

@Component({
  selector: 'qddt-preview-instrument',
  moduleId: module.id,
  template: `
  <div class="row">
    <div class="col s12">
      <label [attr.for]="instrument.id + '-description'" class="active teal-text">Description</label>
      <textarea class="materialize-textarea" id="{{instrument?.id}}-description"
      name="{{instrument?.id}}-description" readonly>
      </textarea>
    </div>
  </div>
  <ul *ngIf="instrument.sequence" materialize="collapsible" class="collapsible"
      data-collapsible="accordion" style="margin:25px; padding:10px;">
    <li *ngFor="let cc of instrument.sequence">
      <div class="collapsible-header yellow lighten-5">
        <div class="col l10">{{ cc?.elementRef.name }}</div>
        <div class="col l2">
          <qddt-version-label [element]="cc.elementRef"></qddt-version-label>
        </div>
      </div>
      <div class="collapsible-body">
        <qddt-preview-controlconstruct [construct]="cc.elementRef.element"></qddt-preview-controlconstruct>
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
  providers: [ ],
})

export class PreviewInstrumentComponent {
  @Input() instrument: Instrument;
}
