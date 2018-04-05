import { Component, Input, Output, OnInit, EventEmitter, AfterContentChecked } from '@angular/core';
import { ControlConstructService, QuestionConstruct } from '../controlconstruct.service';
import { Observable } from 'rxjs/Observable';
import { QuestionItem } from '../../question/question.service';
import { IOtherMaterial } from '../../shared/elementinterfaces/othermaterial';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-control-construct-form',
  moduleId: module.id,
  templateUrl: 'questionconstruct.form.component.html',
  styles: [
    '.nomargin { margin:0; }',
    ':host /deep/ .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class QuestionConstructFormComponent implements OnInit, AfterContentChecked {
  @Input() controlConstruct: QuestionConstruct;
  @Input() readonly: boolean;
  @Output() savedAction = new EventEmitter<QuestionConstruct>();

  public savedquestionitem: any;

  private editQuestoinItem: boolean;
  private showUploadFileForm: boolean;
  private showUploadedFiles: boolean;
  private showQuestionButton: boolean;
  private showbutton = false;

  private files: FileList;
  private fileStore: any[];
  private toDeleteFiles: any[];

  constructor(private service: ControlConstructService) {
    this.editQuestoinItem = false;
    this.showUploadFileForm = false;
    this.showUploadedFiles = false;
    this.showQuestionButton = false;

    this.fileStore = [];
    this.toDeleteFiles = [];
  }

  ngOnInit() {
    if (!this.readonly) {
      this.readonly = false;
    }
  }

  ngAfterContentChecked() {
    Materialize.updateTextFields();
  }

  // onDeleteUniverse(id: number) {
  //   this.controlConstruct.universe.splice(id, 1);
  // }

  onAddUniverse(item: any) {
    this.controlConstruct.universe.push(item);
    // this.createUniverse = false;
  }


  onDeletePreInstruction(id: number) {
    this.controlConstruct.preInstructions.splice(id, 1);
  }

  onAddPreInstruction(instruction: any) {
    this.controlConstruct.preInstructions.push(instruction);
  }

  // onDeletePostInstruction(id: number) {
  //   this.controlConstruct.postInstructions.splice(id, 1);
  // }

  onAddPostInstruction(instruction: any) {
    this.controlConstruct.postInstructions.push(instruction);
  }


  onSelectQuestionItem(element: QuestionItem) {
    this.controlConstruct.questionItem = element;
    this.controlConstruct.questionItemRevision = element['questionItemRevision'];
    this.editQuestoinItem = false;
  }

  onRemoveQuestoinItem() {
    this.controlConstruct.questionItem = null;
    this.editQuestoinItem = false;
  }

  onDownloadFile(o: IOtherMaterial) {
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
      (data) => { filesaver.saveAs(data, fileName); },
      (error) => { throw error; });
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

  OnSave() {
/*     this.fileStore.forEach(
      (file) => formData.append(file)
    )

    const formData: FormData = new FormData();
    if (picture !== null || picture !== undefined) {
      formData.append('files', picture, picture.name);
    }
    formData.append('article', JSON.stringify(article)); */

  }


  onSaveControlConstruct() {
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
    const elementEvent = this.savedAction;
    source.subscribe(
      function () {
        service.updateQuestion(controlConstruct).subscribe(
          (result) => {
            this.controlConstruct = result;
            elementEvent.emit(result); },
          (error: any) => {
          throw error;
        });
      },
      function (error: any) {
        throw error;
      });
  }

}
