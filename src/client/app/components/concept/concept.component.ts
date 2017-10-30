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
  @Output() conceptSelectedEvent: EventEmitter<any> = new EventEmitter();
  @Input() topic: any;
  @Input() show: boolean;
  confimDeleteActions = new EventEmitter<string|MaterializeAction>();

  private showConceptForm: boolean = false;
  private showProgressBar: boolean = false;
  private concept: any;
  private concepts: any;
  private toDeletedConcept: any;

  constructor(private conceptService: ConceptService) {
    this.concept = new Concept();
  }

  ngOnChanges() {
    console.log('ngOnChanges concept');
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
    console.log('onSelectConcept...');
    this.topic = concept;
    this.concepts = concept.children;
  }

  onToggleConceptForm() {
    this.showConceptForm = !this.showConceptForm;
  }

  onNewSave() {
    this.showConceptForm = false;
    this.showProgressBar = true;
      this.conceptService.save(this.concept, this.topic.id)
      .subscribe((result: any) => {
            this.onConceptUpdated(result);
      }
    ,(err: any) => console.log('ERROR: ', err));
    this.concept  = new Concept();
  }

  onConceptUpdated(concept:any) {
    console.log('onConceptSavedEvent ' + concept.name);
    if (!this.updateConcept(this.concepts, concept)) {
      this.concepts.push(concept);
    }
    this.showProgressBar = false;
  }

  onDeleteConcept(concept: any) {
    this.toDeletedConcept = concept;
    this.confimDeleteActions.emit({action:'modal', params:['open']});
  }

  onConfirmDeleteConcept() {
    let id = this.toDeletedConcept.id;
    this.conceptService.deleteConcept(id)
      .subscribe((result:any) => {
        this.confimDeleteActions.emit({action:'modal', params:['close']});
        if (result.ok)
          this.removeConcept(this.concepts,id);
      },
      (error: any) => {console.log(error);});
  }

  private updateConcept(concepts:Concept[], concept:Concept) : boolean {
    let found = false;
    let i = -1;
    while(!found && ++i < concepts.length) {
      console.log(i);
      found = this.updateConcept(concepts[i].children,concept);
      if (concepts[i].id === concept.id) {
        concepts[i] = concept;
        found = true;
      }
    }
    return found;
  }

  private removeConcept(concepts:Concept[], conceptId:any) : boolean {
    let found = false;
    let i = -1;
    while(!found && ++i < concepts.length) {
      found = this.removeConcept(concepts[i].children,conceptId);
      if (concepts[i].id === conceptId) {
        concepts.splice(i,1);
        found = true;
      }
    }
    return found;
  }

}
