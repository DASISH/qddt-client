
import {Component, Input} from 'angular2/core';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';

@Component({
  selector: 'show-error',
  moduleId: module.id,
  template: `
  <a materialize="leanModal" [materializeParams]="[{dismissible: true}]"
    class="waves-effect waves-light modal-trigger" href="#error-detail-modal">
    <i class="material-icons teal-text">Error</i>
  </a>
  <div id="error-detail-modal" class="modal modal-fixed-footer">
    <div class="modal-content">
      <div class="row">
        <p>Error</p>
          {{message}}
      </div>
    </div>
  </div>
  <div class="modal-footer">
      <button class="btn btn-default modal-action modal-close waves-effect red lighten-2 waves-red">DISMISS</button>
  </div>
  `,
  providers: [],
  pipes: [],
  directives: [MaterializeDirective],
})

export class ShowError {

  @Input() message:any;


}
