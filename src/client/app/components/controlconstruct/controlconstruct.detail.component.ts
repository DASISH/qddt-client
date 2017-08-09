import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ControlConstructService, ControlConstruct } from './controlconstruct.service';
import { MaterializeAction } from 'angular2-materialize';
import * as fileSaver from 'file-saver';
// let fileSaver = require('../../../common/file-saver');

@Component({
  selector: 'qddt-control-construct-detail',
  moduleId: module.id,
  templateUrl: './controlconstruct.detail.component.html',
  styles: [`:host /deep/ .hoverable .row {
            min-height:3rem;
            margin-bottom:0px; 
            }`],
  providers: [ControlConstructService],
})

export class ControlConstructDetailComponent implements OnInit {
  @Input() controlConstruct: ControlConstruct;
  @Input() controlConstructId: string;
  @Input() controlConstructs: ControlConstruct[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() exceptionEvent: EventEmitter<String> = new EventEmitter<String>();

  public deleteAction = new EventEmitter<string|MaterializeAction>();

  private revisionIsVisible: boolean;
  private savedObject: string;
  private savedControlConstructsIndex: number;
  private config: any[];

  constructor(private service: ControlConstructService) {
    this.revisionIsVisible = false;
  }

  ngOnInit() {
    if (this.controlConstructs === null || this.controlConstructs === undefined) {
      this.controlConstructs = [];
    }
    if (this.controlConstructId !== null && this.controlConstructId !== undefined) {
      this.service.getControlConstruct(this.controlConstructId)
        .subscribe((result: any) => {
          this.controlConstruct = result;
          this.init();
        },
        (error: any) => console.log(error));
    } else {
      this.init();
    }
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onDeleteControlConstructModal() {
    this.deleteAction.emit({action:'modal', params:['open']});
    // this.deleteAction.emit({action:'modal', params:['open']});
  }

  onConfirmDeleting() {
    this.service.deleteControlConstruct(this.controlConstruct.id)
      .subscribe((result: any) => {
        let i = this.controlConstructs.findIndex(q => q['id'] === this.controlConstruct.id);
        if (i >= 0) {
          this.controlConstructs.splice(i, 1);
        }
        this.hideDetailEvent.emit('hide');
      },
      (error: any) => console.log(error));
  }

  onElementEvent(result: any) {
    let index = this.controlConstructs.findIndex((e: any) => e.id === result.id);
    if (index >= 0) {
      this.controlConstructs[index] = result;
    } else if (this.savedControlConstructsIndex >= 0) {
      this.controlConstructs[this.savedControlConstructsIndex] = JSON.parse(this.savedObject);
      this.controlConstructs.push(result);
    }
    this.hideDetailEvent.emit('hide');
  }

  onExceptionEvent(error: any) {
    this.exceptionEvent.emit(error);
  }

  private getPdf(element: ControlConstruct) {
    let fileName = element.name + '.pdf';
    this.service.getPdf(element.id).subscribe(
      (data: any) => {
        fileSaver(data, fileName);
      },
      error => console.log(error));
  }

  // private popupModal(error: any) {
  //   this.exceptionEvent.emit(error);
  // }

  private init() {
    // if(this.controlConstruct !== null && this.controlConstruct !== undefined) {
    //   this.controlConstruct['workinprogress'] = this.controlConstruct['changeKind'] === 'IN_DEVELOPMENT';
    // }
    this.savedObject = JSON.stringify(this.controlConstruct);
    this.savedControlConstructsIndex = this.controlConstructs
      .findIndex(q => q['id'] === this.controlConstruct['id']);
    this.config = this.buildRevisionConfig();
  }

  private buildRevisionConfig(): any[] {
    let config: any[] = [];
    config.push({'name':'name','label':'Name'});
    config.push({'name':['questionItem'],'label':'Question Text', 'init': function (q: any) {
      if(q && q['question'] && q['question']['question']) {
        return q['question']['question'];
      }
      return '';
    }});
    config.push({'name':['questionItem', 'version'],'label':'QI_Version', 'init': function (version: any) {
      if(version !== null && version !== undefined) {
        return 'V' + version['major'] + '.' + version['minor'];
      }
      return '';
    }});
    config.push({'name':['preInstructions'],'label':'Pre Instructions', 'init': function (o: any) {
      if(o !== null && o !== undefined) {
        return o.map(element => {return element['description'] || '';}).sort().join(',');
      }
      return '';
    }});
    config.push({'name':['postInstructions'],'label':'Post Instructions', 'init': function (o: any) {
      if(o !== null && o !== undefined) {
        return o.map(element => {return element['description'] || '';}).sort().join(',');
      }
      return '';
    }});
    config.push({'name':['otherMaterials'],'label':'Files', 'init': function (o: any) {
      if(o !== null && o !== undefined) {
        return o.map(element => {return element['originalName'] || '';}).sort().join(',');
      }
      return '';
    }});
    return config;
  }
}
