import { AfterContentChecked, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HEADER_DETAILS } from '../shared/elementinterfaces/headerdetail';
import { QuestionConstruct } from './controlconstruct.service';
import { IEntityAudit } from '../shared/elementinterfaces/entityaudit';

// declare var Materialize: any;

@Component({
  selector: 'qddt-control-construct',
  moduleId: module.id,
  providers: [],
  templateUrl: './controlconstruct.component.html',
})

export class ControlConstructComponent  implements AfterContentChecked {

  public icon: any;
  public headerName: string;
  public newItem: IEntityAudit;
  public showForm = false;


  constructor( private route: ActivatedRoute ) {
    this.route.url.subscribe((event) => {
      const path = this.route.firstChild.routeConfig.path;
      this.icon = HEADER_DETAILS.get(path).icon;
      this.headerName =  HEADER_DETAILS.get(path).headerName;
    });
  }



  ngAfterContentChecked(): void {
    // Materialize.updateTextFields();
  }

  onToggleForm() {
    this.showForm = !this.showForm;
    this.newItem =  new QuestionConstruct();
  }
}
