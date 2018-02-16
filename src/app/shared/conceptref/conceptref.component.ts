import { Component, Input,  EventEmitter } from '@angular/core';
import { ConceptrefService } from './conceptref.service';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-conceptref',
  moduleId: module.id,
  templateUrl: 'conceptref.component.html',
  providers: [ConceptrefService]
})
export class ConceptrefComponent  {
  // @ViewChild('closeBtn') closeBtn: ElementRef;
  @Input() element: any;

  public usedbyModalAction = new EventEmitter<string|MaterializeAction>();
  public selectedElement: any;

  private selectedType: string;
  private showRefs: any;

  constructor(private service: ConceptrefService) {
  }

  onClickStudy(id: string) {
    this.selectedType = 'study';
    this.service.getStudyById(id)
      .then((result: any) => {
        this.selectedElement = result;
        this.usedbyModalAction.emit({action: 'modal', params: ['open']});
      });
  }

  onClickTopic(id: string) {
    this.selectedType = 'topic';
    this.service.getTopicById(id)
      .then((result: any) => {
        this.selectedElement = result;
        this.usedbyModalAction.emit({action: 'modal', params: ['open']});
      });
  }

  onClickConcept(id: string) {
    this.selectedType = 'concept';
    this.service.getConceptsById(id)
      .then((result: any) => {
        this.selectedElement = result;
        this.usedbyModalAction.emit({action: 'modal', params: ['open']});
      });
  }


}
