import { Component, EventEmitter, OnInit} from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import { ActionKind, Concept, ElementKind, IMoveTo, Topic} from '../../../classes';
import { HomeService} from '../home.service';
import { PropertyStoreService} from '../../core/services';


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
  public concept: Concept;

  refreshCount = 0;

  constructor(private property: PropertyStoreService, private homeService: HomeService ) {
    this.readonly = !homeService.canDo.get(ElementKind.CONCEPT).get(ActionKind.Create);
    this.concept = new Concept();
   }



  ngOnInit(): void {
    this.topic = new Topic(this.property.get('topic'));
    this.topic.id = this.topic.id || this.property.parentMenu.id ;
    this.topic.concepts = this.property.get('concepts');
    if (!this.topic.concepts) {
      this.showProgressBar = true;
      this.homeService.getConceptByTopic(this.topic.id).then(
        (result) => {
          this.topic.concepts = result.content; // .sort( (a, b) => a.name.localeCompare(b.name));
          this.property.set('concepts', this.topic.concepts);
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
      this.homeService.update(this.topic).subscribe(
        (result) => { this.onConceptUpdated(result); },
        (error) => { throw error; },
        () => { this.showProgressBar = false; } );
    this.concept  = new Concept();
  }

  onMoveConcept(event: IMoveTo) {
    console.log(event);
    const entity = this.removeConcept(this.topic.concepts, event.source);
    let target: Concept[];
    if (event.target === this.topic.id) {
      target = this.topic.concepts;
    } else  {
      target = this.findConcept(this.topic.concepts, event.target).children;
    }
    const start  = target.slice(0, event.index) || [];
    const end    = target.slice(event.index) || [];
    if (event.target === this.topic.id) {
      this.topic.concepts = [].concat(start, entity, end);
    } else  {
      this.findConcept(this.topic.concepts, event.target).children = [].concat(start, entity, end);
    }
  }

  onConceptUpdated(concept: Concept) {
    if (!this.updateConcept(this.topic.concepts, concept)) {
      this.topic.concepts.push(concept);
      // this.topic.concepts = this.topic.concepts.sort( (a, b) => a.name.localeCompare(b.name));
    }
    this.property.set('concepts', this.topic.concepts);
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
        this.removeConcept(this.topic.concepts, this.toDeletedConcept.id);
        this.property.set('concepts', this.topic.concepts);
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

  findConcept(concepts: Concept[], conceptId): Concept {
    let i = -1;
    while (++i < concepts.length) {
      if (concepts[i].id === conceptId) {
        return concepts[i];
      }
      const found = this.findConcept(concepts[i].children, conceptId);
      if (found) {
        return found;
      }
    }
    return null;
  }

}
