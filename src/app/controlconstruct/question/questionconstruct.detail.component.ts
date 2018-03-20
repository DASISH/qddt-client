import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ControlConstructService, QuestionConstruct } from '../controlconstruct.service';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind } from '../../preview/preview.service';
const filesaver = require('file-saver');


@Component({
  selector: 'qddt-control-construct-detail',
  moduleId: module.id,
  templateUrl: './questionconstruct.detail.component.html',
  styles: [`:host /deep/ .hoverable .row {
            min-height:3rem;
            margin-bottom:0px; }`],
})

export class QuestionConstructDetailComponent implements OnInit {
  @Input() controlConstruct: QuestionConstruct;
  @Input() controlConstructId: string;
  @Input() controlConstructs: QuestionConstruct[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent = new EventEmitter<String>();
  @Output() exceptionEvent = new EventEmitter<String>();

  public deleteAction = new EventEmitter<MaterializeAction>();
  private readonly revisionKind = ElementKind.QUESTION_CONSTRUCT;
  private previewObject: any;
  private revisionIsVisible: boolean;
  private savedObject: string;
  private savedControlConstructsIndex: number;
  private config: any[];

  constructor(private service: ControlConstructService) {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
    if (!this.controlConstructs) {
      this.controlConstructs = [];
    }
    if (this.controlConstructId) {
      this.service.getControlConstruct(this.controlConstructId)
        .then((result: any) => {
          this.controlConstruct = result;
          this.init();
        })
        .catch((error) =>  {
          throw error;
        });
    } else {
      this.init();
    }
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onDeleteControlConstructModal() {
    this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleting() {
    this.service.deleteControlConstruct(this.controlConstruct.id)
      .subscribe(() => {
        const i = this.controlConstructs.findIndex(q => q['id'] === this.controlConstruct.id);
        if (i >= 0) {
          this.controlConstructs.splice(i, 1);
        }
        this.hideDetailEvent.emit('hide');
      });
  }

  onccSaveAction(result: any) {
    const index = this.controlConstructs.findIndex((e: any) => e.id === result.id);
    if (index >= 0) {
      console.log('onccSaveAction replace ' + result.name);
      this.controlConstructs[index] = result;
    } else {
      console.log('onccSaveAction added ' + result.name);
      this.controlConstructs.push(result);
    }
    console.log(result.version);
    this.hideDetailEvent.emit('hide');
  }

  onExceptionEvent(error: any) {
    this.exceptionEvent.emit(error);
  }

  onDownloadFile(o: any) {
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
      },
      error => { throw error; });
  }

  onGetPdf( c: QuestionConstruct) {
    this.service.getPdf(c.id).then(
      (data: any) => {
        filesaver.saveAs(data, c.name + '.pdf');
      },
      error => { throw error; });
  }

  onShowRevision(element: any) {
    this.previewObject = element;
  }

  private init() {

    this.savedObject = JSON.stringify(this.controlConstruct);
    this.savedControlConstructsIndex = this.controlConstructs
      .findIndex(q => q['id'] === this.controlConstruct['id']);
    this.config = this.buildRevisionConfig();
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
