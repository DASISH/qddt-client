import { Component, Input, Output, EventEmitter } from '@angular/core';

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

export class ControlConstructDetailComponent {
  @Input() controlConstruct: ControlConstruct;
  @Input() controlConstructs: ControlConstruct[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  @Output() exceptionEvent: EventEmitter<String> = new EventEmitter<String>();
  editQuestoinItem: boolean;
  instructionActions = new EventEmitter<string>();
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

  constructor(private service: ControlConstructService) {
    this.revisionIsVisible = false;
    this.createPostInstruction = false;
    this.createPreInstruction = false;
    this.editQuestoinItem = false;
    this.showUploadFileForm = false;
    this.showUploadedFiles = false;
    this.fileStore = [];
    this.toDeleteFiles = [];
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
        let blob: Blob = new Blob( Array.from(data._body), { type: fileType});
        fileSaver(blob, fileName);
        if(data._body.length !== len) {
          this.popupModal('The received size of the file is ' + data._body.length
            + '. But the expected size is ' + len);
        }
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
}
