import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {LocalDatePipe} from '../../common/date_pipe';
import {ConceptRevision} from './concept_revision.component';
import {ConceptChildrenList} from './concept_children_list.component';
import {QuestionListComponent} from './question_list.component';
import {ConceptEditComponent} from './edit/concept_edit.component';
import {ConceptService, Concept} from './concept.service';
import {CommentListComponent} from '../comment/comment_list.component';

@Component({
  selector: 'concept',
  moduleId: module.id,
  providers: [ConceptService],
  directives: [ConceptRevision,CommentListComponent, ConceptEditComponent, ConceptChildrenList, QuestionListComponent],
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
  private parentIsTopic: boolean;

  constructor(private conceptService: ConceptService) {
    this.concept = new Concept();
    this.parentIsTopic = true;
  }

  ngOnChanges() {
    this.conceptService.getByTopic(this.topic.id)
      .subscribe(result => {this.concepts = result.content;});
  }

  onSelectConcept(concept: any) {
    this.parentIsTopic = false;
    this.topic = concept;
    this.concepts = concept.children;
  }

  onToggleConceptForm() {
    this.showConceptForm = !this.showConceptForm;
  }

  onSave() {
    this.showConceptForm = false;
    if(this.parentIsTopic) {
      this.conceptService.save(this.concept, this.topic.id)
        .subscribe(result => {
          this.concepts.push(result);
       });
    } else {
      this.conceptService.saveChildConcept(this.concept, this.topic.id)
        .subscribe(result => {
          this.concepts.push(result);
       });
    }
    this.concept  = new Concept();
  }

}
