import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { ControlConstructService, ControlConstruct } from './controlconstruct.service';
import { Observable }     from 'rxjs/Observable';

let fileSaver = require('./filesaver');
@Component({
  selector: 'qddt-controle-construct-detail',
  moduleId: module.id,
  templateUrl: './controlconstruct.detail.component.html',
  styles: [
    '.nomargin: { margin:0; }'
  ],
  providers: [ControlConstructService],
})

export class ControlConstructDetailComponent implements OnInit {
  @Input() controlConstruct: ControlConstruct;
  @Input() controlConstructId: string;
  @Input() controlConstructs: ControlConstruct[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() exceptionEvent: EventEmitter<String> = new EventEmitter<String>();
  editQuestoinItem: boolean;
  instructionActions = new EventEmitter<string>();
  deleteAction = new EventEmitter<any>();
  createPostInstruction: boolean;
  createPreInstruction: boolean;
  private revisionIsVisible: boolean;
  private selectedInstruction: any;
  private isPost: boolean;
  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
  private files: FileList;
  private fileStore: any[];
  private toDeleteFiles: any[];
  private savedObject: string;
  private savedControlConstructsIndex: number;
  private config: any[];
  private showPreinstructionButton: any;
  private showPostinstructionButton: any;
  private showQuestionButton: any;

  constructor(private service: ControlConstructService) {
    this.revisionIsVisible = false;
    this.createPostInstruction = false;
    this.createPreInstruction = false;
    this.editQuestoinItem = false;
    this.showUploadFileForm = false;
    this.showUploadedFiles = false;
    this.fileStore = [];
    this.toDeleteFiles = [];
    this.showPreinstructionButton = false;
    this.showPostinstructionButton = false;
    this.showQuestionButton = false;
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

  onDeletePreInstruction(id: number) {
    this.controlConstruct.preInstructions.splice(id, 1);
  }

  onAddPreInstruction(instruction: any) {
    this.controlConstruct.preInstructions.push(instruction);
    this.createPreInstruction = false;
  }

  onDeletePostInstruction(id: number) {
    this.controlConstruct.postInstructions.splice(id, 1);
  }

  onAddPostInstruction(instruction: any) {
    this.controlConstruct.postInstructions.push(instruction);
    this.createPostInstruction = false;
  }

  onClickPreInstruction(id: number) {
    this.selectedInstruction = this.controlConstruct.preInstructions[id];
    this.isPost = false;
    this.instructionActions.emit('openModal');
  }

  onClickPostInstruction(id: number) {
    this.selectedInstruction = this.controlConstruct.postInstructions[id];
    this.isPost = true;
    this.instructionActions.emit('openModal');
  }

  onUseQuestionItem() {
    this.editQuestoinItem = false;
  }

  onRemoveQuestoinItem() {
    this.controlConstruct.questionItem = null;
    this.editQuestoinItem = false;
  }

  onDownloadFile(o: any) {
    let fileType = o.fileType || 'text/plain';
    let fileName = o.originalName;
    let len = o.size;
    this.service.getFile(o.id).subscribe(
      (data: any) => {
        fileSaver(data, fileName);
      },
      error => this.popupModal(error));
  }

  onSelectFile(filename: any) {
    this.files = filename.target.files;
  }

  onDeleteFile(idx: number) {
    if(this.controlConstruct.otherMaterials
      && this.controlConstruct.otherMaterials.length > idx) {
      let items = this.controlConstruct.otherMaterials.splice(idx, 1);
      if(items.length > 0) {
        this.toDeleteFiles.push(items[0]);
      }
    }
  }

  onDeleteFileFromLocal(idx: number) {
    if(this.fileStore && this.fileStore.length > idx) {
      this.fileStore.splice(idx, 1);
    }
  }

  onUploadFile() {
    this.fileStore.push(this.files);
    this.showUploadFileForm = false;
    this.files = null;
  }

  onDeleteControlConstructModal() {
    this.deleteAction.emit('openModal');
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

  onSaveControlConstruct() {
    let controlConstruct = this.controlConstruct;
    let controlConstructs = this.controlConstructs;
    let files = this.fileStore;
    let len = files.length;
    let source = Observable.of({});
    let toDeleteFiles = this.toDeleteFiles;
    if (len > 0 || this.toDeleteFiles.length > 0) {
      source = Observable.range(0, len + this.toDeleteFiles.length)
        .flatMap((x: any) => {
          if(x < len) {
            let file = files[x];
            return this.service.uploadFile(controlConstruct.id, file);
          } else {
            let file = toDeleteFiles[x - len];
            return this.service.deleteFile(file.id);
          }
        });
    }
    let index = 0;
    let hideDetailEvent = this.hideDetailEvent;
    let service = this.service;
    let savedControlConstructsIndex = this.savedControlConstructsIndex;
    let object = this.savedObject;
    source.subscribe(
      function (x: any) {
        if (index < len && x.id !== undefined && x.id !== null) {
          controlConstruct['otherMaterials'].push(x);
          index = index + 1;
        }
      },
      function (error: any) {
        console.log('Error: %s', error);
      },
      function () {
        service.update(controlConstruct).subscribe((result: any) => {
          let index = controlConstructs.findIndex((e: any) => e.id === result.id);
          if (index >= 0) {
            controlConstructs[index] = result;
          } else if (savedControlConstructsIndex >= 0) {
            controlConstructs[savedControlConstructsIndex] = JSON.parse(object);
            controlConstructs.push(result);
          }
          hideDetailEvent.emit('hide');
        }, (error: any) => {
          console.log('Error: %s', error);
        });
      });
  }

  private popupModal(error: any) {
    this.exceptionEvent.emit(error);
  }

  private init() {
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
