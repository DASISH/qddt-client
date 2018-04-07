import { Component, EventEmitter, OnInit } from '@angular/core';
import { SequenceConstruct, ControlConstructService } from '../controlconstruct.service';
import { MaterializeAction } from 'angular2-materialize';
import { Router, ActivatedRoute } from '@angular/router';
import { IDetailAction, Action} from '../../shared/elementinterfaces/detailaction';

const filesaver = require('file-saver');

@Component({
  selector: 'qddt-sequence-detail',
  moduleId: module.id,
  templateUrl: './sequenceconstruct.detail.component.html',
})




export class SequenceDetailComponent implements OnInit {

  public deleteAction = new EventEmitter<MaterializeAction>();
  public revisionIsVisible = false;
  public sequence: SequenceConstruct;

  private action: IDetailAction;

  constructor(private service: ControlConstructService, private router: Router, private route: ActivatedRoute ) {
  }

  ngOnInit() {
    this.action = { id: '', action: Action.None, object: null };
    this.service.getControlConstruct<SequenceConstruct>(this.route.snapshot.paramMap.get('id')).then(
      (ctrl) => {
        this.action.id = ctrl.id;
        this.sequence = ctrl;
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
    this.service.deleteControlConstruct(this.sequence.id)
      .subscribe(() => {
        this.action.action = Action.Delete;
        this.onHideDetail();
      });
  }

  onSequenceSaved(result: SequenceConstruct) {
    this.action.action = Action.Update;
    this.action.object = result;
    this.onHideDetail();
  }

  onGetPdf( ctrl: SequenceConstruct) {
    this.service.getPdf(ctrl.id).then(
      (data) => { filesaver.saveAs(data, ctrl.name + '.pdf'); },
      (error) => { throw error; });
  }

}
