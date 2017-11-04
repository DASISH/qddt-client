import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ControlConstructService, ControlConstruct } from './controlconstruct.service';
import { Observable }     from 'rxjs/Observable';
import { MaterializeAction } from 'angular2-materialize';
//let saveAs = require('file-saver');
let saveAs = require('file-saver');


@Component({
  selector: 'qddt-control-construct-form',
  moduleId: module.id,
  templateUrl:'controlconstruct.form.component.html',
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  providers: [ControlConstructService],
})

export class ControlConstructFormComponent implements OnInit {
  @Input() controlConstruct: ControlConstruct;
  @Input() isNew: boolean;
  @Input() readonly: boolean;
  @Output() controlConstructSavedAction = new EventEmitter<any>();
  @Output() exceptionEvent = new EventEmitter<String>();

  public basedonActions = new EventEmitter<string|MaterializeAction>();
  public basedonObject: any;
  public savedquestionitem: any;
  public createPostInstruction: boolean;
  public createPreInstruction: boolean;
  public createUniverse: boolean;

  private editQuestoinItem: boolean;
  private revisionIsVisible: boolean;

  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
  private showPreinstructionButton: boolean;
  private showPostinstructionButton: boolean;
  private showUniverseButton: boolean;
  private showQuestionButton: boolean;
  private showbutton: boolean = false;
  private files: FileList;
  private fileStore: any[];
  private toDeleteFiles: any[];
  // private savedObject: string;

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
    if(this.isNew) {
      this.controlConstruct.id = new Date().toString();
    }
    if(this.readonly === null || this.readonly === undefined) {
      this.readonly = false;
    }
  }

  onBasedonObjectDetail(ref:any) {
    if (!ref.rev)
      ref.rev=0;
    this.service.getControlConstructRevision(ref.id,ref.rev)
      .subscribe(
        (result: any) => {
          this.basedonObject = result.entity;
          this.basedonActions.emit({action:'modal', params:['open']});
        },
        (err: any) => null
      );
  }

  onDeleteUniverse(id: number) {
    this.controlConstruct.universe.splice(id, 1);
  }

  onAddUniverse(instruction: any) {
    this.controlConstruct.universe.push(instruction);
    this.createUniverse = false;
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
    let fileName = o.originalName;
    this.service.getFile(o.id).subscribe(
      (data: any) => {
        saveAs(data, fileName);
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
    console.info('onSaveControlConstruct');
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

    let service = this.service;
    let elementEvent = this.controlConstructSavedAction;
    source.subscribe(
      function (x: any) {
        service.update(controlConstruct).subscribe((result: any) => {
          this.controlConstruct = result;
          elementEvent.emit(result);
        }, (error: any) => {
          console.log('Error: %s', error);
        });
      }),
      function (error: any) {
        console.log('Error: %s', error);
      };
  }

  private popupModal(error: any) {
    this.exceptionEvent.emit(error);
  }

}
