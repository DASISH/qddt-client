import {Component, Input, EventEmitter, Output, ElementRef} from 'angular2/core';

import {LocalDatePipe} from '../../common/date_pipe';

import {ConceptService, Concept} from './concept.service';
import {CommentListComponent} from '../comment/comment_list.component';
import {ConceptEditComponent} from './edit/concept_edit.component';
import {ConceptRevision} from './concept_revision.component';

declare var jQuery:any;

@Component({
  selector: 'concept',
  moduleId: module.id,
  templateUrl: './concept.component.html',
  directives: [CommentListComponent, ConceptEditComponent, ConceptRevision],
  pipes: [LocalDatePipe],
  providers: [ConceptService]
})
export class ConceptComponent {

  showConceptForm: boolean = false;
  @Input() showConcept: boolean;
  model: Concept;
  concepts: Array<Concept> = [];
  @Output() surveyCreateEvent: EventEmitter<String> = new EventEmitter();

  constructor(private conceptService: ConceptService, private elementRef: ElementRef) {
    this.model = new Concept();
    this.concepts = this.conceptService.getModel();
  }

  ngOnInit() {
    console.log('init');
    jQuery(this.elementRef.nativeElement).find('select').material_select();
  }

  save() {
    this.showConceptForm = false;
    this.conceptService.save(this.model);
    this.concepts = this.conceptService.getModel();
    this.model = new Concept();
  }

  toggleConceptForm() {
    jQuery(this.elementRef.nativeElement).find('select').material_select();
    this.showConceptForm = !this.showConceptForm;
  }

  create(concept: any) {
    this.surveyCreateEvent.emit(concept);
  }

}
