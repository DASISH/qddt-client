import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ControlConstructService, ControlConstruct } from './controlconstruct.service';

@Component({
  selector: 'qddt-controle-construct-detail',
  moduleId: module.id,
  templateUrl: './controlconstruct.detail.component.html',
  providers: [ControlConstructService],
})

export class ControlConstructDetailComponent {
  @Input() controlConstruct: ControlConstruct;
  @Input() controlConstructs: ControlConstruct[];
  @Input() isVisible: boolean;
  @Output() hideDetailEvent: EventEmitter<String> = new EventEmitter<String>();
  instructionActions = new EventEmitter<string>();
  createPostInstruction: boolean;
  private revisionIsVisible: boolean;
  private selectedInstruction: any;
  private isPost: boolean;

  constructor(private service: ControlConstructService) {
    this.revisionIsVisible = false;
    this.createPostInstruction = false;
  }

  hideDetail() {
    this.hideDetailEvent.emit('hide');
  }

  onDeletePreInstruction(id: number) {
    this.controlConstruct.preInstructions.splice(id, 1);
  }

  onAddPreInstruction(instruction: any) {
    this.controlConstruct.preInstructions.push(instruction);
  }

  onDeletePostInstruction(id: number) {
    this.controlConstruct.postInstructions.splice(id, 1);
  }

  onAddPostInstruction(instruction: any) {
    this.controlConstruct.postInstructions.push(instruction);
    this.createPostInstruction = false;
  }

  onClickPreInstruction(id: number) {
    this.selectedInstruction = this.controlConstruct.preInstructions[id];
    this.isPost = false;
    this.instructionActions.emit('openModal');
  }

  onClickPostInstruction(id: number) {
    this.selectedInstruction = this.controlConstruct.postInstructions[id];
    this.isPost = true;
    this.instructionActions.emit('openModal');
  }

  onSaveControlConstruct() {
    this.service.edit(this.controlConstruct).subscribe((result: any) => {
        let index = this.controlConstructs.findIndex((e:any) => e.id === result.id);
        if(index >= 0) {
          this.controlConstructs[index] = result;
        }
        this.hideDetail();
      }, (error: any) => {
        console.log(error);
      });
  }
}
