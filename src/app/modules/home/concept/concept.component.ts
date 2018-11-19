import { Component, EventEmitter, OnInit} from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { Concept, Topic } from '../../../classes/home.classes';
import { HomeService } from '../home.service';
import {ActionKind, ElementKind, IMoveTo} from '../../../classes';
import {PropertyStoreService} from '../../core/services';


@Component({
  selector: 'qddt-concept',
  providers: [],
  templateUrl: './concept.component.html'
})

export class ConceptComponent implements OnInit {
  public readonly conceptKind = ElementKind.CONCEPT;
  public confirmDeleteActions = new EventEmitter<string|MaterializeAction>();
  public showReuse = false;
  public showConceptForm = false;
  public showProgressBar = false;
  public readonly: boolean;
  public toDeletedConcept: any;
  public topic: Topic;
  public concepts: any;
  public concept: Concept;

  refreshCount = 0;

  constructor(private property: PropertyStoreService, private homeService: HomeService ) {
    this.readonly = !homeService.canDo.get(ElementKind.CONCEPT).get(ActionKind.Create);
    this.concept = new Concept();
   }



  ngOnInit(): void {
    this.topic = this.property.get('topic');
    const parentId = this.topic.id || this.property.parentMenu.id ;
    this.concepts = this.property.get('concepts');
    if (!this.concepts) {
      this.showProgressBar = true;
      this.homeService.getConceptByTopic(parentId).then(
        (result) => {
          this.concepts = result.content; // .sort( (a, b) => a.name.localeCompare(b.name));
          this.property.set('concepts', this.concepts);
        },
        (error) => { throw error; })
        .then( () => this.showProgressBar = false );
    }
  }

  onToggleConceptForm() {
    this.showConceptForm = !this.showConceptForm;
    if (this.showConceptForm) {
      this.showReuse = false;
    }
  }

  onToggleReuse() {
    this.showReuse = !this.showReuse;
    if (this.showReuse) {
      this.showConceptForm = false;
    }
  }

  onNewSave() {
    this.showConceptForm = false;
    this.showProgressBar = true;
    this.topic.concepts.push(this.concept);
      this.homeService.update(this.topic).subscribe(
        (result) => { this.onConceptUpdated(result); },
        (error) => { throw error; },
        () => { this.showProgressBar = false; } );
    this.concept  = new Concept();
  }

  onMoveConcept(event: IMoveTo) {
    console.log(event);
    if (event.before) {

    }
  }


  onConceptUpdated(concept: any) {
    if (!this.updateConcept(this.concepts, concept)) {
      this.concepts.push(concept);
      // this.concepts = this.concepts.sort( (a, b) => a.name.localeCompare(b.name));
    }
    this.property.set('concepts', this.concepts);
    this.showProgressBar = false;
  }

  onDeleteConcept(concept: any) {
    this.toDeletedConcept = concept;
    this.confirmDeleteActions.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleteConcept() {
    this.homeService.deleteConcept(this.toDeletedConcept.id)
      .subscribe(
      (val) => {
        this.confirmDeleteActions.emit({action: 'modal', params: ['close']});
        this.removeConcept(this.concepts, this.toDeletedConcept.id);
        this.property.set('concepts', this.concepts);
      },
      response => { throw response; },
        () => {
          console.log('The DELETE observable is now completed.');
      });
  }

  onSelectedRevsion(concept: Concept) {
    this.showReuse = false;
    this.onConceptUpdated(concept);
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


  private removeConcept(concepts: Concept[], conceptId: any): Concept {
    let i = -1;
    while (++i < concepts.length) {
      if (concepts[i].id === conceptId) { return concepts.splice(i, 1)[0]; }
      const deleted = this.removeConcept(concepts[i].children, conceptId);
      if (deleted) { return deleted; }
    }
    return null;
  }

}
