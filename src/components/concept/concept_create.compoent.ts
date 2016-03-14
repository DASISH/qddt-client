import {Component, Output, EventEmitter} from 'angular2/core';

import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

import {ConceptService, Concept} from './concept.service';

@Component({
  selector: 'concept-create',
  directives: [MaterializeDirective],
  template: `

      <a materialize="leanModal" [materializeParams]="[{dismissible: false}]"
        class="modal-trigger btn " href="#concept-modal">
         <i class="material-icons left">create</i> Add new Concept
      </a>

      <div id="concept-modal" class="modal">
        <div class="modal-content">

        <h3 class="teal-text ">Add new Concept</h3>

          <form (ngSubmit)="save()" #hf="ngForm">

            <div class="row">
              <div class="input-field col">
                <input id="name" type="text" [(ngModel)]="concept.name" required>
                <label for="name" class="teal-text">Name</label>
              </div>
            </div>

            <div class="row">
              <div class="input-field col">
                <input id="label" type="text" [(ngModel)]="concept.label" required>
                <label for="label" class="teal-text">Label</label>
              </div>
            </div>

            <div class="row">
              <div class="input-field col s10">
                <textarea id="description" class="materialize-textarea" [(ngModel)]="concept.description" required></textarea>
                <label for="description" class="teal-text">Description</label>
              </div>
            </div>


            <button type="submit" class="btn btn-default green waves-green">Submit</button>
          </form>
        </div>
        <div class="modal-footer">
          <button  class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
      </div>
  `
})
export class ConceptCreateComponent {

  private concept: Concept;
  @Output() private conceptCreatedEvent: EventEmitter<any> = new EventEmitter();

  constructor(private conceptService: ConceptService) {
    this.concept = new Concept();
  }

  save() {
    this.conceptService.save(this.concept).subscribe(result => {
      this.concept = new Concept();
      this.conceptCreatedEvent.emit(result);
    });
  }

}
