import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ControlConstructService, ControlConstruct } from './controlconstruct.service';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind } from '../preview/preview.service';
const saveAs = require('file-saver');


@Component({
  selector: 'qddt-control-construct-detail',
  moduleId: module.id,
  templateUrl: './controlconstruct.detail.component.html',
  styles: [`:host /deep/ .hoverable .row {
            min-height:3rem;
            margin-bottom:0px; }`],
  providers: [ControlConstructService],
})

export class ControlConstructDetailComponent implements OnInit {
  @Input() controlConstruct: ControlConstruct;
  @Input() controlConstructId: string;
  @Input() controlConstructs: ControlConstruct[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent = new EventEmitter<String>();
  @Output() exceptionEvent = new EventEmitter<String>();

  public deleteAction = new EventEmitter<MaterializeAction>();
  private previewObject: any;
  private revisionKind = ElementKind.QUESTION_CONSTRUCT;
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
        saveAs(data, fileName);
      },
      error => console.log(error));
  }

  onGetPdf( c: ControlConstruct) {
    this.service.getPdf(c.id).then(
      (data: any) => {
        saveAs(data, c.name + '.pdf');
      },
      error => console.log(error));

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
      if (q && q['question'] && q['question']['question']) {
        return q['question']['question'];
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
        return o.map(element => {return element['description'] || ''; }).sort().join(',');
      }
      return '';
    }});
    config.push({'name': ['postInstructions'], 'label': 'Post', 'init': function (o: any) {
      if (o !== null && o !== undefined) {
        return o.map(element => {return element['description'] || ''; }).sort().join(',');
      }
      return '';
    }});
    config.push({'name': ['otherMaterials'], 'label': 'Files', 'init': function (o: any) {
      if (o !== null && o !== undefined) {
        return o.map(element => {return element['originalName'] || ''; }).sort().join(',');
      }
      return '';
    }});
    return config;
  }
}
