import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import {ActionKind, ElementKind} from '../shared/classes/enums';
import { IElement, IEntityEditAudit, IRevisionRef } from '../shared/classes/interfaces';
import { ElementRevisionRef, Page } from '../shared/classes/classes';
import { TemplateService } from '../template/template.service';
import { SequenceKind, SequenceConstruct} from '../controlconstruct/controlconstruct.classes';

@Component({
  selector: 'qddt-sequence-form',
  moduleId: module.id,
  templateUrl: './sequence-construct.form.component.html',
  styles: [ ]
})

export class SequenceFormComponent implements OnChanges {
  @Input() sequence: SequenceConstruct;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<SequenceConstruct>();

  public readonly QUESTION = ElementKind.QUESTION_CONSTRUCT;
  public selectedElement: IEntityEditAudit;
  public questionConstrucs: IEntityEditAudit[];
  public revisionList = [];
  public showProgressBar = false;
  public readonly formId = Math.round( Math.random() * 10000);

  public currentSequenceKind: SequenceKind = SequenceKind.SECTION;
  public sequenceKinds: { id: any; name: string; }[];
  private StringIsNumber = value => isNaN(Number(value)) === false;

  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.SEQUENCE_CONSTRUCT);
    this.sequenceKinds = Object.keys(SequenceKind)
    .filter(this.StringIsNumber)
    .map(key => ({ id: key , name: SequenceKind[key] }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.currentSequenceKind = SequenceKind[this.sequence.sequenceKind];
  }

  public onSaveConstruct() {
    this.service.update(this.sequence).subscribe(
      (result) => {
          this.sequence = result;
          this.modifiedEvent.emit(result); },
      (error) => { throw error; }
    );
  }

  public onSearchElements(search: IElement) {
    this.service.searchByKind( { kind: this.QUESTION, key: search.element, page: new Page( { size: 15 } ) } ).then(
      (result) => { this.questionConstrucs = result.content; },
      (error) => { throw error; } );
  }

  public onRevisonSearch(search: IRevisionRef) {
    const kind = this.service.getElementKind(search.elementKind);
    this.service.getRevisionsByKind(kind, search.elementId).then(
      (result) => {
        this.revisionList = result.content;
      }
    );
  }

  public onSelectChange(event) {
    this.currentSequenceKind = event;

  }

  public onRevisionSelected(ref: ElementRevisionRef) {
    this.sequence.sequence.push(ref);
  }

  public onSelectCanceled(value) {
    this.selectedElement = null;
  }


}

