import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {LocalDatePipe} from '../../common/date_pipe';
import {ConceptService, Concept} from './concept.service';
import {TreeNodeComponent} from './tree-node.component';
import {ConceptTocComponent} from './concept-toc';
//import {Response} from 'angular2/http';

@Component({
  selector: 'concept',
  moduleId: module.id,
  providers: [ConceptService],
  directives: [TreeNodeComponent, ConceptTocComponent],
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
    this.conceptService.getByTopic(this.topic.id)
      .subscribe(result => this.concepts = result.content
                ,(err) => console.log('ERROR: ', err));
  }

  onSelectConcept(concept: any) {
    this.topic = concept;
    this.concepts = concept.children;
  }

  onToggleConceptForm() {
    this.showConceptForm = !this.showConceptForm;
  }

  onSave() {
    this.showConceptForm = false;
    this.conceptService.save(this.concept, this.topic.id)
      .subscribe(result => this.concepts.push(result)
                ,(err) => console.log('ERROR: ', err));
        this.concept  = new Concept();
  }


}
