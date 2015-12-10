import {Component, Inject} from 'angular2/angular2';

import {AgencyService, Agency} from '../agency/agencyservice';

@Component({
  selector: 'agency',
  template: `
      <div class="card white white-text text-lighten-2">
        <div class="row teal z-depth-1" style="padding-left:2%;padding-top:1%;padding-bottom:1%;">
          <i class="material-icons large right">business</i><h4 style="font-weight:300;">Agency</h4>
        </div>
        <div class="row" style="padding-left:2%">
          <div class="col s12 m6 l6 grey-text text-darken-2">
            {{agency.name}}
            </div>

        </div>
      </div>
  `,
  providers: [AgencyService],
  bindings: [AgencyService]
})
export class AgencyComponent {

  agencyService: AgencyService;
  agency: Agency;

  constructor(@Inject(AgencyService)agencyService: AgencyService) {
    this.agencyService = agencyService;
    this.agency = this.agencyService.get();
  }
}
