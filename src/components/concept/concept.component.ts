import {Component} from 'angular2/core';

import {ConceptListComponent} from '../concept/concept_list.component';

@Component({
  selector: 'concept',
  moduleId: module.id,
  directives: [ConceptListComponent],
  template: `
    <div class="white white-text text-lighten-2">
      <div class="row teal z-depth-1" style="padding-left:2%;padding-top:1%;padding-bottom:1%;">
        <i class="material-icons large right">content_paste</i><h2>Concept</h2>
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

}
