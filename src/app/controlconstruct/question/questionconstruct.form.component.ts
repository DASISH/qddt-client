import { Component, Input, Output, OnInit, EventEmitter, AfterContentChecked } from '@angular/core';
import { ControlConstructService, QuestionConstruct } from '../controlconstruct.service';
import { Observable } from 'rxjs/Observable';
import { MaterializeAction } from 'angular2-materialize';
import { QuestionItem } from '../../question/question.service';
import { IEntityAudit } from '../../interfaces/entityaudit';
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
  @Input() isNew: boolean;
  @Input() readonly: boolean;
  @Output() savedAction = new EventEmitter<QuestionConstruct>();

  public savedquestionitem: any;
  public questionItems: QuestionItem[];

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
  private searchUniverses: IEntityAudit[];

  constructor(private service: ControlConstructService) {
    this.revisionIsVisible = false;
    this.createPostInstruction = false;
    this.createPreInstruction = false;
    this.editQuestoinItem = false;
    this.showUploadFileForm = false;
    this.showUploadedFiles = false;
    this.showPreinstructionButton = false;
    this.showPostinstructionButton = false;
    this.showQuestionButton = false;

    this.fileStore = [];
    this.toDeleteFiles = [];
  }

  ngOnInit() {
    if (this.isNew) {
      this.controlConstruct.id = new Date().valueOf.toString();
    }
    if (!this.readonly) {
      this.readonly = false;
    }
    this.service.getQuestionItems('').then(
      (results) => this.questionItems = results
    );
  }

  ngAfterContentChecked() {
    Materialize.updateTextFields();
  }

  onDeleteUniverse(id: number) {
    this.controlConstruct.universe.splice(id, 1);
  }

  onAddUniverse(item: any) {
    this.controlConstruct.universe.push(item);
    // this.createUniverse = false;
  }

  onSearchUniverse(key: string) {
    this.service.searchUniverses(key).then((result: any) => {
        this.searchUniverses = result.content;
      });
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


  onSearchQuestionItems(key: string) {
    this.service.searchQuestionItemsByNameAndQuestion(key).then((result: any) => {
      this.questionItems = result.content;
    });
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

  onDownloadFile(o: any) {
    const fileName = o.originalName;
    this.service.getFile(o.id).then(
      (data: any) => {
        filesaver.saveAs(data, fileName);
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
