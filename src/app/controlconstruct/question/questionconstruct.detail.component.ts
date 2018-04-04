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
  public config: any[];
  public controlConstruct: QuestionConstruct;
  private action: IDetailAction;

  constructor(private service: ControlConstructService, private router: Router, private route: ActivatedRoute ) {
    this.config = this.buildRevisionConfig();
  }

  ngOnInit() {
    this.action = { id: '', action: Action.None, object: null };
    this.service.getControlConstruct<QuestionConstruct>(this.route.snapshot.paramMap.get('id')).then(
      (ctrl) => {
        this.action.id = ctrl.id;
        this.controlConstruct = ctrl; },
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



  private buildRevisionConfig(): any[] {
    const config: any[] = [];
    config.push({'name': 'name', 'label': 'Name'});
    config.push({'name': ['questionItem'], 'label': 'Question', 'init': function (q: any) {
      if (q && q['question'] && q['question']) {
        return q['question'];
      }
      return '';
    }});
    config.push({'name': ['questionItem', 'version'], 'label': 'QI_Version', 'init': function (version: any) {
      if (version !== null && version !== undefined) {
        return 'V' + version['major'] + '.' + version['minor'];
      }
      return '';
    }});
    config.push({'name': ['preInstructions'], 'label': 'Pre', 'init': function (o: any) {
      if (o !== null && o !== undefined) {
        return o.map((element: any) => element['description'] || '').sort().join(',');
      }
      return '';
    }});
    config.push({'name': ['postInstructions'], 'label': 'Post', 'init': function (o: any) {
      if (o !== null && o !== undefined) {
        return o.map((element: any) => element['description'] || '').sort().join(',');
      }
      return '';
    }});
    config.push({'name': ['otherMaterials'], 'label': 'Files', 'init': function (o: any) {
      if (o !== null && o !== undefined) {
        return o.map((element: any) => element['originalName'] || '').sort().join(',');
      }
      return '';
    }});
    return config;
  }
}
