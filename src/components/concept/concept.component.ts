import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {LocalDatePipe} from '../../common/date_pipe';
import {ConceptRevision} from './concept_revision.component';
import {ConceptService, Concept} from './concept.service';
import {CommentListComponent} from '../comment/comment_list.component';

@Component({
  selector: 'concept',
  moduleId: module.id,
  providers: [ConceptService],
  directives: [ConceptRevision,CommentListComponent],
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

  ngOnChanges() {
    console.log( 'Change getByTopic ->' +this.topic.id);
    this.conceptService.getByTopic(this.topic.id)
      .subscribe(result => this.concepts = result.content);
  }


  onSelectConcept(concept: any) {
    this.conceptSelectedEvent.emit(concept);
  }

  onToggleConceptForm() {
    this.showConceptForm = !this.showConceptForm;
  }

  onSave() {
    this.showConceptForm = false;
    this.conceptService.save(this.concept,this.topic.id)
      .subscribe(result => {
        this.concepts.push(result);
      });
    this.concept  = new Concept();
  }

  onSaveChildConcept(parentConceptId :string) {

    this.conceptService.saveChildConcept(this.concept, parentConceptId)
      .subscribe(result => {
        this.concepts.push(result);
      });
    this.concept  = new Concept();
  }

}
