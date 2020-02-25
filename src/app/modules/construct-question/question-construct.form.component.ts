import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ActionKind,
  ElementKind,
  ElementRevisionRef,
  IElement,
  IElementRef,
  IRevisionRef,
  LANGUAGE_MAP,
  MessageService,
  QuestionConstruct,
  TemplateService,
  QuestionItem, ElementRevisionRefImpl
} from '../../lib';
import { Router } from '@angular/router';

@Component({
  selector: 'qddt-question-construct-form',
  styles: [
    '.card-panel:hover > ul.dropleft { display:block; }',
  ],
  templateUrl: 'question-construct.form.component.html',
})

export class QuestionConstructFormComponent {
  @Input() controlConstruct: QuestionConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<QuestionConstruct>();

  public readonly UNIVERSE = ElementKind.UNIVERSE;
  public readonly INSTRUCTION = ElementKind.INSTRUCTION;
  public readonly LANGUAGES = LANGUAGE_MAP;
  public readonly formId = Math.round(Math.random() * 10000);
  public SOURCE: IElement | IRevisionRef | null;

  public showUploadFileForm: boolean;
  public showProgressBar = false;
  public showButton = false;
  public fileStore: File[] = [];

  constructor(private service: TemplateService, private router: Router, private message: MessageService, ) {
    this.showUploadFileForm = false;
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.CONTROL_CONSTRUCT);

  }

  public onAddUniverse(item: IElement) {
    this.controlConstruct.universe.push(item.element);
  }

  public onAddPreInstruction(item: IElement) {
    this.controlConstruct.preInstructions.push(item.element);
  }

  public onAddPostInstruction(item: IElement) {
    this.controlConstruct.postInstructions.push(item.element);
  }

  public onRemoveUniverse(item: IElementRef) {
    this.controlConstruct.universe = this.controlConstruct.universe.filter(u => u.id !== item.elementId);
  }

  public onRemovePreInstruction(item: IElementRef) {
    this.controlConstruct.preInstructions = this.controlConstruct.preInstructions.filter(u => u.id !== item.elementId);
  }

  public onRemovePostInstruction(item: IElementRef) {
    this.controlConstruct.postInstructions = this.controlConstruct.postInstructions.filter(u => u.id !== item.elementId);
  }

  public onQuestionEdit() {
    this.service.searchByUuid(this.controlConstruct.questionItemRef.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }

  public onQuestionRemove() {
    this.controlConstruct.questionItemRef = null;
  }

  public onQuestionSync() {
    this.SOURCE = this.controlConstruct.questionItemRef
  }

  public onQuestionSearch() {
    this.SOURCE = { elementKind: ElementKind.QUESTION_ITEM, element: '' } as IElement;
  }

  public onRevisionSelect(rev: ElementRevisionRefImpl<QuestionItem>) {
    rev.name = rev.element.name;
    rev.text = rev.element.question;
    this.controlConstruct.questionItemRef = rev;
    console.log(rev || JSON);
    this.SOURCE = null;
  }

  public onQuestionPreview() {
    this.message.sendMessage(this.controlConstruct.questionItemRef);
  }

  async onSave() {

    const formData = new FormData();
    formData.append('controlconstruct', JSON.stringify(this.controlConstruct));
    this.fileStore.forEach((file) => { formData.append('files', file); });

    this.modifiedEvent.emit(
      this.controlConstruct =
      await this.service.updateWithFiles(ElementKind.QUESTION_CONSTRUCT, formData).toPromise());
  }

}
