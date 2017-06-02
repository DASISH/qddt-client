import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ConceptService, Concept } from './concept.service';
import { MaterializeAction } from 'angular2-materialize';

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
  actions = new EventEmitter<string|MaterializeAction>();

  private concept: any;
  private concepts: any;
  private toDeletedConcept: any;
  private showProgressBar: boolean = false;

  constructor(private conceptService: ConceptService) {
    this.concept = new Concept();
  }

  ngOnChanges() {
    this.showProgressBar = true;
    this.conceptService.getByTopic(this.topic.id)
      .subscribe((result: any) => {
        this.concepts = result.content;
        this.showProgressBar = false;
      }
          ,(err: any) => console.log('ERROR: ', err)
      );
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
    this.showProgressBar = true;
      this.conceptService.save(this.concept, this.topic.id)
      .subscribe((result: any) => {
                  this.concepts.push(result);
                  this.showProgressBar = false;
                }
                ,(err: any) => console.log('ERROR: ', err));
        this.concept  = new Concept();
  }

  onDeleteConcept(concept: any) {
    this.toDeletedConcept = concept;
    this.actions.emit({action:'modal', params:['open']});
    // this.actions.emit({action:'modal', params:['open']});
  }

  onConfirmDeleteConcept() {
    let id = this.toDeletedConcept.id;
    this.conceptService.deleteConcept(id)
      .subscribe((result: any) => {
        this.actions.emit({action:'modal', params:['close']});
        this.concepts = [];
        this.conceptService.getByTopic(this.topic.id)
          .subscribe((result: any) => this.concepts = result.content
          , (err: any) => console.log('ERROR: ', err));
      },
      (error: any) => {console.log(error);});
  }
}
