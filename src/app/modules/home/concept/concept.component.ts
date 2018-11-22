import { Component, EventEmitter, OnInit} from '@angular/core';
import { MaterializeAction } from 'angular2-materialize';
import {ActionKind, Concept, ElementKind, IEntityEditAudit, IMoveTo, Topic} from '../../../classes';
import { HomeService} from '../home.service';
import { PropertyStoreService} from '../../core/services';


@Component({
  selector: 'qddt-concept',
  providers: [ {provide: 'elementKind', useValue: 'CONCEPT'}, ],
  templateUrl: './concept.component.html'
})

export class ConceptComponent implements OnInit {
  public readonly CONCEPT = ElementKind.CONCEPT;
  public confirmDeleteActions = new EventEmitter<string|MaterializeAction>();

  public showReuse = false;
  public showConceptForm = false;
  public showProgressBar = false;
  public readonly: boolean;

  public toDeletedConcept: any;
  public topic: Topic;

  constructor(private property: PropertyStoreService, private homeService: HomeService<Concept> ) {
    this.readonly = !homeService.canDo.get(ActionKind.Create);
   }

  async ngOnInit() {
    this.topic = new Topic(this.property.get('topic')) ||
                 await this.homeService.getExt<Topic>(ElementKind.TOPIC_GROUP, this.property.parentMenu.id);

    this.showProgressBar = true;

    this.topic.concepts = this.property.get('concepts') ||
      await this.homeService.getPageByParent(this.topic.id).then(
        () => this.showProgressBar = false);
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

  onNewSave(newConcept) {
    this.showConceptForm = false;
    this.showProgressBar = true;
      this.homeService.create(new Concept(newConcept), this.topic.id).subscribe(
        (result) => { this.onConceptUpdated(result); },
        (error) => { throw error; },
        () => { this.showProgressBar = false; } );
  }

  async onMoveConcept(event: IMoveTo) {
    console.log(event);
    const entity = this.removeConcept(this.topic.concepts, event.source);
    let targets: Concept[];
    if (event.target === this.topic.id) {
      targets = this.topic.concepts;
    } else  {
      targets = this.findConcept(this.topic.concepts, event.target).children;
    }

    const start  = targets.slice(0, event.index) || [];
    const end    = targets.slice(event.index) || [];
    targets = [].concat(start, entity, end);
    targets.forEach( c => this.setUHR(c));

    if (event.target === this.topic.id) {
      this.topic.concepts = targets;
    } else  {
      this.findConcept(this.topic.concepts, event.target).children = targets;
    }

    const result = await this.homeService.updateAll(this.topic.concepts).toPromise();
    this.topic = await this.homeService.getExt<Topic>(ElementKind.TOPIC_GROUP, this.topic.id);
    this.topic.concepts = result;

  }

  onConceptUpdated(concept: Concept) {
    if (!this.updateConcept(this.topic.concepts, concept)) {
      this.topic.concepts.push(concept);
    }
    this.property.set('concepts', this.topic.concepts);
    this.showProgressBar = false;
  }

  onDeleteConcept(concept: any) {
    this.toDeletedConcept = concept;
    this.confirmDeleteActions.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleteConcept() {
    this.homeService.delete(this.toDeletedConcept.id).subscribe(
      (val) => {
        console.log(val);
        this.confirmDeleteActions.emit({action: 'modal', params: ['close']});
        this.removeConcept(this.topic.concepts, this.toDeletedConcept.id);
        this.property.set('concepts', this.topic.concepts);
      },
      response => { throw response; },
        () => {
          console.log('The DELETE observable is now completed.');
      });
  }

  onSelectedRevision(concept: Concept) {
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

  private findConcept(concepts: Concept[], conceptId): Concept {
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

  private setUHR(entity: IEntityEditAudit) {
    if (entity.changeKind !== 'IN_DEVELOPMENT') { entity.changeKind = 'UPDATED_HIERARCHY_RELATION'; }
  }

}
