import { Component, Input } from '@angular/core';
import { Concept } from '../../home/concept/concept.service';

@Component({
  selector: 'qddt-preview-concept',
  moduleId: module.id,
  styles: [
      'div.collapsible { margin:20px;}',
      'collapsible-header { display: flow-root; margin-bottom: 0px; margin-left: unset; }'
  ],
  templateUrl: 'preview.concept.component.html',
  providers: [ ],
})

export class PreviewConceptComponent {
  @Input() concept: Concept;

}
