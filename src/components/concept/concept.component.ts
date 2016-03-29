import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {LocalDatePipe} from '../../common/date_pipe';
import {ConceptListComponent} from './concept_list.component';
import {ConceptRevision} from './concept_revision.component';
import {ConceptService, Concept} from './concept.service';

@Component({
  selector: 'concept',
  moduleId: module.id,
  providers: [ConceptService],
  directives: [ConceptListComponent, ConceptRevision],
  pipes: [LocalDatePipe],
  templateUrl: './concept.component.html'
})

export class ConceptComponent {
  showConceptForm: boolean = false;
  @Output() conceptSelectedEvent: EventEmitter<any> = new EventEmitter();
  @Input() topic: any;
  @Input() show: boolean;

  private concept: any;
  private concepts: any;
  constructor(private conceptService: ConceptService) {
    this.concept = new Concept();
  }

  ngAfterViewInit() {
    this.conceptService.getAll().subscribe(result => this.concepts = result.content);
  }


  onSelectConcept(concept: any) {
    this.conceptSelectedEvent.emit(concept);
  }

  onToggleConceptForm() {
    this.showConceptForm = !this.showConceptForm;
  }

  onSave() {
    this.showConceptForm = false;
    this.conceptService.save(this.concept).subscribe(result => {
      this.concepts.push(result);
    });
    this.concept  = new Concept();
  }
}
