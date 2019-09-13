import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QuestionItem } from '../question/question.classes';
import {
  ActionKind,
  ElementKind,
  ElementRevisionRef,
  IElement,
  Instruction,
  IRevisionRef,
  IRevisionResult,
  Page,
  QuestionConstruct, Universe
} from '../../classes';
import {TemplateService} from '../../components/template';


@Component({
  selector: 'qddt-question-construct-form',
  templateUrl: 'question-construct.form.component.html',
  styles: [
    '.nomargin { margin:0; }',
    ':host ::ng-deep .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
})

export class QuestionConstructFormComponent   {
  @Input() controlConstruct: QuestionConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionConstruct>();

  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public readonly INSTRUCTION = ElementKind.INSTRUCTION;
  public readonly QUESTION = ElementKind.QUESTION_ITEM;

  public readonly formId = Math.round( Math.random() * 10000);

  /* public savedQuestionItem: any; */
  public instructionList: Instruction[];
  public universeList: Universe[];
  public questionList: QuestionItem[];
  public revisionResults: IRevisionResult<QuestionItem>[];

  public showUploadFileForm: boolean;
  public showProgressBar = false;

  public fileStore: File[] = [];


  constructor(private service: TemplateService) {
    this.showUploadFileForm = false;
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.CONTROL_CONSTRUCT);

  }

  onAddUniverse(item: IElement) {
    this.controlConstruct.universe.push(item.element);
  }

  onAddPreInstruction(item: IElement) {
    this.controlConstruct.preInstructions.push(item.element);
  }

  onAddPostInstruction(item: IElement) {
    this.controlConstruct.postInstructions.push(item.element);
  }

  onInstructionSearch(key: string) {
    this.service.searchByKind<Instruction>( {kind: this.INSTRUCTION, key: key , page: new Page() }).then(
      (result) => {
        this.instructionList = result.content;
      });
  }

  onUniverseSearch(key: string) {
    this.service.searchByKind<Universe>(  {kind: this.UNIVERSE, key: key, page: new Page() }).then(
      (result) => {
        this.universeList = result.content;
      });
  }

  onQuestionSearch(key: IElement) {
    this.service.searchByKind<QuestionItem>( {kind: this.QUESTION, key: key.element, page: new Page() } ).then(
      (result) => {
        this.questionList = result.content;
      });
  }

  public onDismiss() {
    this.revisionResults = null;
    this.questionList = null;
  }

  onRevisionSearch(item: IRevisionRef) {
    this.service.getByKindRevisions<QuestionItem>(this.QUESTION, item.elementId ).then(
      (result) => {
        this.revisionResults = result.content;
      });

  }

  onRevisionSelect(ref: ElementRevisionRef ) {
    this.controlConstruct.questionItem = ref.element;
    this.controlConstruct.questionItemRevision = ref.elementRevision;
    this.questionList = [];
    this.revisionResults = [];
  }

  onRemoveQuestionItem() {
    this.controlConstruct.questionItem = null;
  }

  async onSaveForm() {

    const formData = new FormData();
    formData.append('controlconstruct', JSON.stringify(this.controlConstruct));
    this.fileStore.forEach( (file) => { formData.append('files', file); });

    this.modifiedEvent.emit(
      this.controlConstruct =
        await this.service.updateWithFiles(ElementKind.QUESTION_CONSTRUCT, formData).toPromise());
  }

}
