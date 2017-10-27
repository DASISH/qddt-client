import { Component, EventEmitter, Output } from '@angular/core';

import { ControlConstructService, Instruction } from './controlconstruct.service';
import { ElementKind, QddtElementTypes } from '../../shared/preview/preview.service';

@Component({
  selector: 'qddt-instruction-create',
  moduleId: module.id,
  template: `
  <div class="row card">
    <div class="col s10 black-text">
      <label>Description</label>
      <div [ngClass]="{ noItemFound: (isInstructionNew && instruction.description.length > 0 && instructions.length === 0) }">
		    <autocomplete 
          [items]="instructions" class="black-text"
          [elementtype]="INSTRUCTION"
          [initialValue]="instruction?.description"
          (autocompleteSelectEvent)="onSelectInstruction($event)"
		      (enterEvent)="onSearchInstructions($event)">
		</autocomplete>
	  </div>
    </div>
    <div class="col s2 right">
      <a class="waves-effect waves-light btn" (click)="onAddInstruction()">add</a>
    </div>
  </div>
  `,
  styles: [
    `.noItemFound {
        border: thick solid orange;
    }`
  ],
  providers: [ControlConstructService],
})

export class InstructionComponent {
  @Output() createInstructionEvent = new EventEmitter<any>();

  instruction: any;
  instructions: any[];
  isInstructionNew: boolean;
  private readonly INSTRUCTION = QddtElementTypes[ElementKind.INSTRUCTION];

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
    this.service.searchInstructions(key).subscribe((result: any) => {
      this.instructions = result.content;
      this.isInstructionNew = this.instructions.length === 0;
    },
      (error: any) => { console.log(error); });
  }

  onSelectInstruction(instruction: any) {
    this.instruction = instruction;
  }

}
