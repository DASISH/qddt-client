import {Component} from 'angular2/core';

import {ConceptService, Concept} from './concept.service';
import {ConceptCreateComponent} from './concept_create.compoent';

import {LocalDatePipe} from '../../common/date_pipe';

@Component({
  selector: 'concept-list',
  moduleId: module.id,
  pipes: [LocalDatePipe],
  directives: [ConceptCreateComponent],
  providers: [ConceptService],
  template: `
  <div class="card white grey-text text-darken-1">

  <concept-create (conceptCreatedEvent)="conceptCreatedEvent($event)"></concept-create>

    <div *ngIf="concepts">
      <table class="highlight">
        <thead>
          <tr>
            <th data-field="id">Details</th>
            <th data-field="id">Label</th>
            <th data-field="id">Question</th>
            <th data-field="id">Version</th>
            <th data-field="id">Agency</th>
            <th data-field="id">Modified</th>
            <th data-field="id">Modified-By</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="#concept of concepts.content" (click)="selectConcept(concept)">
            <td>
              <concept-detail [concept]="selectedConcept" ></concept-detail>
            </td>
            <td>{{concept.name}}</td>
            <td>{{concept.label}}</td>
            <td>{{concept.description}}</td>
            <td>{{concept.version.major}}.{{concept.version.minor}} {{concept.version.versionlabel}}</td>
            <td>{{concept.agency.name}}</td>
            <td>{{concept.modified | localDate}}</td>
            <td>{{concept.modifiedBy.username}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

`

})
export class ConceptListComponent {

  private selectedConcept: Concept = new Concept();
  private concepts: any = [];

  constructor(private conceptService:ConceptService) {
  }

  ngOnInit() {
    this.conceptService.getAll().subscribe(result => this.concepts = result);
  }

  selectConcept(concept: Concept) {
    this.selectedConcept = concept;
  }

  conceptCreatedEvent() {
    this.conceptService.getAll().subscribe(result => this.concepts = result);
  }
}
