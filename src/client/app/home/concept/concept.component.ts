import { Component, EventEmitter, OnInit } from '@angular/core';
import { ConceptService, Concept } from './concept.service';
import { MaterializeAction } from 'angular2-materialize';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Topic } from '../topic/topic.service';




@Component({
  selector: 'concept',
  moduleId: module.id,
  providers: [ConceptService],
  templateUrl: './concept.component.html'
})

export class ConceptComponent implements OnInit {

  confimDeleteActions = new EventEmitter<string|MaterializeAction>();

  private showConceptForm = false;
  private showProgressBar = false;
  private parentId: any;
  private topic: Topic;
  private concept: any;
  private concepts: any;
  private toDeletedConcept: any;

  constructor(private router: Router, private route: ActivatedRoute,
              private conceptService: ConceptService,private auth: AuthService) {
    this.concept = new Concept();
   }

  ngOnInit(): void {
    this.parentId = this.route.snapshot.paramMap.get('topicId');
    this.topic = this.auth.getGlobalObject('topic');
    this.showProgressBar = true;
    this.conceptService.getByTopic(this.parentId).then((result: any) => {
      this.concepts = result.content;
      this.showProgressBar = false;
    });
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
      });
    this.concept  = new Concept();
  }

  onConceptUpdated(concept: any) {
    console.log('onConceptSavedEvent ' + concept.name);
    if (!this.updateConcept(this.concepts, concept)) {
      this.concepts.push(concept);
    }
    this.showProgressBar = false;
  }

  onDeleteConcept(concept: any) {
    this.toDeletedConcept = concept;
    this.confimDeleteActions.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleteConcept() {
    const id = this.toDeletedConcept.id;
    this.conceptService.deleteConcept(id)
      .subscribe((result: any) => {
        this.confimDeleteActions.emit({action: 'modal', params: ['close']});
        if (result.ok)
          this.removeConcept(this.concepts, id);
      });
  }

  private updateConcept(concepts: Concept[], concept: Concept): boolean {
    let found = false;
    let i = -1;
    while (!found && ++i < concepts.length) {
      console.log(i);
      found = this.updateConcept(concepts[i].children, concept);
      if (concepts[i].id === concept.id) {
        concepts[i] = concept;
        found = true;
      }
    }
    return found;
  }

  private removeConcept(concepts: Concept[], conceptId: any): boolean {
    let found = false;
    let i = -1;
    while (!found && ++i < concepts.length) {
      found = this.removeConcept(concepts[i].children, conceptId);
      if (concepts[i].id === conceptId) {
        concepts.splice(i, 1);
        found = true;
      }
    }
    return found;
  }

}
