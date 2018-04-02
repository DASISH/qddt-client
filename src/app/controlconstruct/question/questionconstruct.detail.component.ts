import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ControlConstructService, QuestionConstruct } from '../controlconstruct.service';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind } from '../../interfaces/elements';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { QuestionItem } from '../../question/question.service';
import { IDetailAction, ActionDetail } from '../../interfaces/detailaction';
import { IOtherMaterial } from '../../interfaces/othermaterial';

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
  controlConstruct: QuestionConstruct;
  private previewObject: any;
  private revisionIsVisible = false;
  private config: any[];
  private action: IDetailAction;

  constructor(private service: ControlConstructService, private router: Router, private route: ActivatedRoute ) {
    this.config = this.buildRevisionConfig();
  }

  ngOnInit() {
    this.action = { id: '', action: ActionDetail.None, object: null };
    this.service.getControlConstruct<QuestionConstruct>(
      this.route.snapshot.paramMap.get('id'))
      .then(ctrl => {
        this.action.id = ctrl.id;
        this.controlConstruct = ctrl; })
      .catch( error => { throw error; } );
    }

  hideDetail() {
      this.router.navigate(['../' ], { relativeTo: this.route });
  }

  onDeleteControlConstructModal() {
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleting() {
    this.service.deleteControlConstruct(this.controlConstruct.id)
      .subscribe(() => {
        this.action.action = ActionDetail.Deleted;
        this.hideDetail();
      });
  }

  onControlConstructSaved(result: QuestionConstruct) {
    this.action.action = ActionDetail.Updated;
    this.action.object = result;
    this.hideDetail();
  }


  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
      (data) => { filesaver.saveAs(data, fileName); },
      (error) => { throw error; });
  }

  onGetPdf( ctrl: QuestionConstruct) {
    this.service.getPdf(ctrl.id).then(
      (data: any) => {
        filesaver.saveAs(data, ctrl.name + '.pdf');
      },
      error => { throw error; });
  }

  onShowRevision(element: any) {
    this.previewObject = element;
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
