import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {ActionKind, ElementKind, Instruction, LANGUAGE_MAP, TemplateService} from '../../lib';

@Component({
  selector: 'qddt-instruction-form',
  templateUrl: './instruction.form.component.html'
})

export class InstructionFormComponent implements AfterViewInit {
  @Input() instruction: Instruction;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<Instruction>();

  public readonly INSTRUCTION = ElementKind.INSTRUCTION;
  public readonly LANGUAGES = LANGUAGE_MAP;
  public formId = Math.round( Math.random() * 10000);

  constructor(private instructionService: TemplateService) {
    if (!this.instruction) {
      this.instruction = new Instruction();
    }
    this.readonly = !this.instructionService.can(ActionKind.Create, this.INSTRUCTION);
  }

  ngAfterViewInit(): void {
    M.updateTextFields();
  }

  onSaveItem() {
    this.instructionService.update<Instruction>(this.instruction).subscribe(
      (result) => {
        this.instruction = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}
