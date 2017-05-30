import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ControlConstructService, ControlConstruct } from './controlconstruct.service';
import { Observable }     from 'rxjs/Observable';
import { MaterializeAction } from 'angular2-materialize/dist';

let fileSaver = require('./filesaver');

@Component({
  selector: 'qddt-control-construct-form',
  moduleId: module.id,
  templateUrl:'controlconstruct.form.component.html',
  styles: [
    '.nomargin: { margin:0; }'
  ],
  providers: [ControlConstructService],
})

export class ControlConstructFormComponent implements OnInit {
  @Input() controlConstruct: ControlConstruct;
  @Input() isNew: boolean;
  @Input() readonly: boolean;
  @Output() elementEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() exceptionEvent: EventEmitter<String> = new EventEmitter<String>();
  editQuestoinItem: boolean;
  createPostInstruction: boolean;
  createPreInstruction: boolean;
  basedonActions = new EventEmitter<string|MaterializeAction>();
  basedonObject: any;
  savedquestionitem: any;
  private revisionIsVisible: boolean;
  // private selectedInstruction: any;
  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
  private showPreinstructionButton: boolean;
  private showPostinstructionButton: boolean;
  private showQuestionButton: boolean;
  private files: FileList;
  private fileStore: any[];
  private toDeleteFiles: any[];
  private savedObject: string;

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
    if(this.isNew === null || this.isNew === undefined) {
      this.isNew = false;
    }
    if(this.isNew) {
      this.controlConstruct.id = new Date().toString();
    }
    if(this.readonly === null || this.readonly === undefined) {
      this.readonly = false;
    }
  }

  onBasedonObjectDetail(id: string) {
    this.service.getControlConstruct(id)
      .subscribe(
      (result: any) => {
        this.basedonObject = result;
        this.basedonActions.emit({action:'modal', params:['open']});
        // this.basedonActions.emit({action:'modal', params:['open']});
      },
      (err: any) => null
      );
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

  onSaveControlConstruct() {
    let controlConstruct = this.controlConstruct;
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
    let service = this.service;
    let object = this.savedObject;
    let elementEvent = this.elementEvent;
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
          elementEvent.emit(result);
        }, (error: any) => {
          console.log('Error: %s', error);
        });
      });
  }

  private popupModal(error: any) {
    this.exceptionEvent.emit(error);
  }

}
