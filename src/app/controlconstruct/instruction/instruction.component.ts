import { Component, EventEmitter, Output } from '@angular/core';

import { ControlConstructService, Instruction } from '../controlconstruct.service';
import { QDDT_ELEMENTS, ElementKind } from '../../shared/elementinterfaces/elements';

@Component({
  selector: 'qddt-instruction-create',
  moduleId: module.id,
  templateUrl: 'instruction.component.html',
  styles: [ ],
})

export class InstructionComponent {
  @Output() createInstructionEvent = new EventEmitter<any>();

  public readonly INSTRUCTION = QDDT_ELEMENTS[ElementKind.INSTRUCTION];
  public instruction: any;
  public instructions: any[];
  public isInstructionNew: boolean;

  constructor(private service: ControlConstructService) {
    this.instruction = new Instruction();
    this.instructions = [];
    this.instruction.description = '';
  }

  onAddInstruction() {
    this.createInstructionEvent.emit(this.instruction);
    this.instruction = new Instruction();
  }

  onSearchInstructions(key: string) {
    this.instruction.description = key;
    this.service.searchByKind(ElementKind.INSTRUCTION, key).then((result: any) => {
      this.instructions = result.content;
      this.isInstructionNew = this.instructions.length === 0;
    });
  }

  onSelectInstruction(instruction: any) {
    this.instruction = instruction;
  }

}
