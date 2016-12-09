import { Component, OnInit } from '@angular/core';
import { ElementTypeDescription, SequenceService } from './sequence.service';

@Component({
  selector: 'qddt-sequence-reuse',
  moduleId: module.id,
  templateUrl: './sequence.reuse.component.html',
  styles: [
    `.noItemFound {
        border: thick solid red;
    }`
  ],
  providers: [SequenceService],
})
export class SequenceReuseComponent implements OnInit {

  showAddElement: boolean = false;
  showReplayElement: boolean = false;
  error: any;
  elementTypeDescription: any = ElementTypeDescription;

  private searchKeys: string;
  private elementType: number;
  private elements: any[];

  constructor(private service: SequenceService) {
    this.searchKeys = '';
    this.elementType = 0;
    this.elements = [];
  }

  ngOnInit() {
    this.searchSequences('');
  }

  onSelectElementType(id: number) {
    this.elementType = id;
    this.searchSequences('');
  }

  onSearchElements(key: string) {
    console.log(key);
  }

  searchSequences(key: string) {
    this.service.getElements(this.elementType, key)
      .subscribe((result: any) => {
        this.elements = result;
      }, (error: any) => {
        this.popupModal(error);
      });
  }

  private popupModal(error: any) {
    this.error = error;
  }
}
