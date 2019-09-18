import { Component, Input } from '@angular/core';
import {Instrument} from '../../../lib/classes';

@Component({
  selector: 'qddt-preview-instrument',

  template: `
  <div class="row">
    <div class="col s12">
      <textarea class="materialize-textarea" id="{{instrument?.id}}-desc" name="{{instrument?.id}}-desc" readonly>
      </textarea>
      <label for ="{{instrument?.id}}-desc" class="teal-text">Description</label>
    </div>
  </div>
  <ul *ngIf="instrument.sequence"s class="collapsible"
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
