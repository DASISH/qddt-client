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
  private children: any;

  constructor(private conceptService: ConceptService) {
    this.concept = new Concept();
    this.children = [{'id':1, 'name':'Concept 1', 'description':'Concept Child  1', 'modified':'Thu Mar 31 2016', 'children':[
                       {'id':12, 'name':'Concept 12', 'description':'Concept Child  12', 'modified':'Thu Mar 31 2016','children':[]}]},
                     {'id':2, 'name':'Concept 2', 'description':'Concept Child  2', 'modified':'Thu Mar 31 2016', 'children':[]},
                     {'id':3, 'name':'Concept 3', 'description':'Concept Child  3', 'modified':'Thu Mar 31 2016', 'children':[]}];
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
