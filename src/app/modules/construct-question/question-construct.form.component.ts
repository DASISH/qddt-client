import {Component, EventEmitter, Input, Output} from '@angular/core';
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
  TemplateService
} from '../../lib';
import {Router} from '@angular/router';

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

  onAddUniverse(item: IElement) {
    this.controlConstruct.universe.push(item.element);
  }

  onAddPreInstruction(item: IElement) {
    this.controlConstruct.preInstructions.push(item.element);
  }

  onAddPostInstruction(item: IElement) {
    this.controlConstruct.postInstructions.push(item.element);
  }

  onRemoveUniverse(item: IElementRef) {
    this.controlConstruct.universe = this.controlConstruct.universe.filter( u => u.id !== item.elementId);
  }

  onRemovePreInstruction(item: IElementRef) {
    this.controlConstruct.preInstructions = this.controlConstruct.preInstructions.filter( u => u.id !== item.elementId);
  }

  onRemovePostInstruction(item: IElementRef) {
    this.controlConstruct.postInstructions = this.controlConstruct.postInstructions.filter( u => u.id !== item.elementId);
  }

  onQuestionEdit() {
    this.service.searchByUuid(this.controlConstruct.questionItem.id).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw  error; });
  }

  onQuestionRemove() {
    this.controlConstruct.questionItem = null;
  }

  onQuestionSync() {
    this.SOURCE = this.refvisionRef;
  }

  onQuestionSearch() {
    this.SOURCE = { elementKind: ElementKind.QUESTION_ITEM, element: '' } as IElement;
  }
  onRevisionSelect(rev: ElementRevisionRef) {
    this.controlConstruct.questionItem = rev.element;
    this.controlConstruct.questionItemRevision = rev.elementRevision;
    this.SOURCE = null;
  }

  public onQuestionPreview() {
    this.message.sendMessage( this.refvisionRef);
  }

  async onSave() {

    const formData = new FormData();
    formData.append('controlconstruct', JSON.stringify(this.controlConstruct));
    this.fileStore.forEach((file) => { formData.append('files', file); });

    this.modifiedEvent.emit(
      this.controlConstruct =
      await this.service.updateWithFiles(ElementKind.QUESTION_CONSTRUCT, formData).toPromise());
  }

  get refvisionRef(): IRevisionRef {
    return {
      elementId: this.controlConstruct.questionItem.id,
      elementRevision: this.controlConstruct.questionItemRevision,
      elementKind: ElementKind.QUESTION_ITEM } as IRevisionRef;
  }

}
