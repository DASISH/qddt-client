import {Component, Input} from 'angular2/core';

import {ConceptService} from './concept.service';

@Component({
  selector: 'concept-questionitem',
  moduleId: module.id,
  pipes: [],
  directives: [],
  providers: [ConceptService],
  styles: [
  ],
  template: `
  <div *ngIf="questionItems.length > 0" class="section">
    <ul class="collection with-header">
      <li class="collection-header">Questions</li>
      <li class="collection-item" *ngFor="#questionItem of questionItems">
        <div>
          <i class="material-icons tiny">help</i> {{questionItem.question}}
          <a href="#!" class="secondary-content" (click)="removeQuestion(questionItem.id)"><i class="material-icons">delete_forever</i></a>
        </div>
      </li>
    </ul>
  </div>
`
})
export class ConceptQuestionComponent {

  @Input() concept: any;
  @Input() questionItems: any;
  selectedIndex: any;

  constructor(private conceptService: ConceptService) {
    this.selectedIndex = 0;
  }

  removeQuestion(questionId:any) {
    this.conceptService.deattachQuestion(this.concept.id, questionId)
      .subscribe(result => {
          this.concept = result;
        }
        ,(err) => console.log('ERROR: ', err));
  }

}
