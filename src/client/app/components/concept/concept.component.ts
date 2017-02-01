import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ConceptService, Concept } from './concept.service';

@Component({
  selector: 'concept',
  moduleId: module.id,
  providers: [ConceptService],
  templateUrl: './concept.component.html'
})

export class ConceptComponent implements OnChanges {
  showConceptForm: boolean = false;
  @Output() conceptSelectedEvent: EventEmitter<any> = new EventEmitter();
  @Input() topic: any;
  @Input() show: boolean;
  actions = new EventEmitter<string>();

  private concept: any;
  private concepts: any;
  private toDeletedConcept: any;

  constructor(private conceptService: ConceptService) {
    this.concept = new Concept();
  }

  ngOnChanges() {
    this.conceptService.getByTopic(this.topic.id)
      .subscribe((result: any) => this.concepts = result.content
                ,(err: any) => console.log('ERROR: ', err));
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
      .subscribe((result: any) => this.concepts.push(result)
                ,(err: any) => console.log('ERROR: ', err));
        this.concept  = new Concept();
  }

  onDeleteConcept(concept: any) {
    this.toDeletedConcept = concept;
    this.actions.emit('openModal');
  }

  onConfirmDeleteConcept() {
    let id = this.toDeletedConcept.id;
    this.conceptService.deleteConcept(id)
      .subscribe((result: any) => {
        this.actions.emit('closeModal');
        this.concepts = [];
        this.conceptService.getByTopic(this.topic.id)
          .subscribe((result: any) => this.concepts = result.content
          , (err: any) => console.log('ERROR: ', err));
      },
      (error: any) => {console.log(error);});
  }
}
