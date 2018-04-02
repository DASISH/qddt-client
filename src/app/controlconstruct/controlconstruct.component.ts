import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IHeaderDetail } from '../interfaces/headerdetail';
import { QuestionConstruct } from './controlconstruct.service';
import { IEntityAudit } from '../interfaces/entityaudit';

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

  private readonly childs: Map<string, IHeaderDetail>  = new Map([
    ['questions', { icon: 'view_agenda', headerName: 'Question constructs' }],
    ['sequences', { icon: 'format_line_spacing', headerName: 'Sequence construct' }]
  ]);

  constructor( private route: ActivatedRoute ) {
    this.route.url.subscribe((event) => {
      const path = this.route.firstChild.routeConfig.path;
      this.icon = this.childs.get(path).icon;
      this.headerName =  this.childs.get(path).headerName;
    });
  }

  newQuestionConstruct() {
  }

  ngAfterContentChecked(): void {
    // Materialize.updateTextFields();
  }

  onToggleForm() {
    this.showForm = !this.showForm;
    this.newItem =  new QuestionConstruct();
  }
}
