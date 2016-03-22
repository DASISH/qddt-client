import {Component, Input, Output, EventEmitter} from 'angular2/core';

import {ConceptListComponent} from './concept_list.component';
import {ConceptService} from './concept.service';

@Component({
  selector: 'concept',
  moduleId: module.id,
  providers: [ConceptService],
  directives: [ConceptListComponent],
  template: `
    <div class="white white-text text-lighten-2" *ngIf="show">
      <div class="row teal z-depth-1" style="padding-left:2%;padding-top:1%;padding-bottom:1%;">
        <i class="material-icons large right">content_paste</i><h2>Concept</h2>
        @ {{topic.name}}
      </div>
    </div>
    <div class="row">
      <div class="col s12 m12 l12">
        <concept-list></concept-list>
      </div>
    </div>
  `
})
export class ConceptComponent {

  @Output() conceptCreated: EventEmitter<any> = new EventEmitter();
  @Input() topic: any;
  @Input() show: boolean;
  private showConceptForm:boolean;

  constructor(private conceptService: ConceptService) {

  }

  ngOnChanges() {
    //this.studies = this.survey.studies;
  }

  onStudySelect(study: any) {
    this.conceptCreated.emit(study);
  }

  onToggleStudyForm() {
    this.show = !this.show;
  }

  onSave() {
    this.showConceptForm = false;
    //this.conceptService.save(this.study,this.survey.id).subscribe(result => {
    //  this.studies.push(result);
    //});
    //this.study  = new Study();
  }

}
