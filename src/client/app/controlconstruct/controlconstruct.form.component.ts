import { Component, Input, Output, OnInit, EventEmitter, AfterContentChecked } from '@angular/core';
import { ControlConstructService, ControlConstruct } from './controlconstruct.service';
import { Observable }     from 'rxjs/Observable';
import { MaterializeAction } from 'angular2-materialize';
const saveAs = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-control-construct-form',
  moduleId: module.id,
  templateUrl: 'controlconstruct.form.component.html',
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  providers: [ControlConstructService],
})

export class ControlConstructFormComponent implements OnInit, AfterContentChecked {
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
  private showbutton = false;
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
    this.showPreinstructionButton = false;
    this.showPostinstructionButton = false;
    this.showQuestionButton = false;
  }

  ngOnInit() {
    if (this.isNew) {
      this.controlConstruct.id = new Date().toString();
    }
    if (this.readonly === null || this.readonly === undefined) {
      this.readonly = false;
    }
  }

  ngAfterContentChecked() {
    Materialize.updateTextFields();
  }

  onBasedonObjectDetail(ref: any) {
    if (!ref.rev)
      ref.rev = 0;
    this.service.getControlConstructRevision(ref.id, ref.rev)
      .then(
        (result: any) => {
          this.basedonObject = result.entity;
          this.basedonActions.emit({action: 'modal', params: ['open']});
        });
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
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
      (data: any) => {
        saveAs(data, fileName);
      });
  }

  onSelectFile(filename: any) {
    this.files = filename.target.files;
  }

  onDeleteFile(idx: number) {
    if (this.controlConstruct.otherMaterials
      && this.controlConstruct.otherMaterials.length > idx) {
      const items = this.controlConstruct.otherMaterials.splice(idx, 1);
      if (items.length > 0) {
        this.toDeleteFiles.push(items[0]);
      }
    }
  }

  onDeleteFileFromLocal(idx: number) {
    if (this.fileStore && this.fileStore.length > idx) {
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
    const controlConstruct = this.controlConstruct;
    const files = this.fileStore;
    const len = files.length;
    let source = Observable.of({});
    const toDeleteFiles = this.toDeleteFiles;
    if (len > 0 || this.toDeleteFiles.length > 0) {
      source = Observable.range(0, len + this.toDeleteFiles.length)
        .flatMap((x: any) => {
          if (x < len) {
            const file = files[x];
            return this.service.uploadFile(controlConstruct.id, file);
          } else {
            const file = toDeleteFiles[x - len];
            return this.service.deleteFile(file.id);
          }
        });
    }
    const service = this.service;
    const elementEvent = this.controlConstructSavedAction;
    source.subscribe(
      function () {
        service.update(controlConstruct).subscribe((result: any) => {
          this.controlConstruct = result;
          elementEvent.emit(result);
        }, (error: any) => {
          console.log('Error: %s', error);
        });
      },
      function (error: any) {
        console.log('Error: %s', error);
      });
  }

  private popupModal(error: any) {
    this.exceptionEvent.emit(error);
  }

}
