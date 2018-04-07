import { Component, EventEmitter, OnInit } from '@angular/core';
import { ControlConstructService, QuestionConstruct } from '../controlconstruct.service';
import { MaterializeAction } from 'angular2-materialize';
import { Router, ActivatedRoute } from '@angular/router';
import { IDetailAction, Action} from '../../shared/elementinterfaces/detailaction';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-control-construct-detail',
  moduleId: module.id,
  templateUrl: './questionconstruct.detail.component.html',
  styles: [
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px; }'
  ],
})

export class QuestionConstructDetailComponent implements OnInit {

  public deleteAction = new EventEmitter<MaterializeAction>();
  public revisionIsVisible = false;
  public controlConstruct: QuestionConstruct;

  private action: IDetailAction;

  constructor(private service: ControlConstructService, private router: Router, private route: ActivatedRoute ) {
  }

  ngOnInit() {
    this.action = { id: '', action: Action.None, object: null };
    this.service.getControlConstruct<QuestionConstruct>(this.route.snapshot.paramMap.get('id')).then(
      (ctrl) => {
        this.action.id = ctrl.id;
        this.controlConstruct = ctrl;
        console.log ( ctrl ); },
      (error) => { throw error; } );
  }

  onHideDetail() {
    this.router.navigate(['../' ], { relativeTo: this.route });
  }

  onDeleteConfirmModal() {
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleting() {
    this.service.deleteControlConstruct(this.controlConstruct.id)
      .subscribe(() => {
        this.action.action = Action.Delete;
        this.onHideDetail();
      });
  }

  onControlConstructSaved(result: QuestionConstruct) {
    this.action.action = Action.Update;
    this.action.object = result;
    this.onHideDetail();
  }

  onGetPdf( ctrl: QuestionConstruct) {
    this.service.getPdf(ctrl.id).then(
      (data) => { filesaver.saveAs(data, ctrl.name + '.pdf'); },
      (error) => { throw error; });
  }

}
