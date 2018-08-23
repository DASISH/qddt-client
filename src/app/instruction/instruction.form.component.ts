import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {ActionKind, ElementKind} from '../shared/classes/enums';
import { TemplateService } from '../template/template.service';
import { Instruction } from '../controlconstruct/controlconstruct.classes';


@Component({
  selector: 'qddt-instruction-form',
  moduleId: module.id,
  templateUrl: './instruction.form.component.html'
})

export class InstructionFormComponent implements OnInit {

  @Input() instruction: Instruction;
  @Input() readonly = false;
  @Output() modifiedEvent =  new EventEmitter<String>();

  public readonly INSTRUCTION = ElementKind.INSTRUCTION;

  public isTemplate: boolean;
  private selectedInstructionIndex: number;


  constructor(private instructionService: TemplateService) {
    this.selectedInstructionIndex = 0;

  }

  ngOnInit() {
    if (!this.instruction) {
      this.instruction = new Instruction();
    }
    this.readonly = !this.instructionService.can(ActionKind.Create, this.INSTRUCTION);
   }


  onSave() {
    this.instructionService.update(this.instruction).subscribe(
      (result) => {
        this.instruction = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }

}