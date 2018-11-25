import { AfterContentChecked, Component, EventEmitter, Input, Output} from '@angular/core';
import { ActionKind, Concept, ElementKind, IRevisionRef, getQueryInfo, ElementRevisionRef} from '../../../classes';
import { HomeService} from '../home.service';
import { QuestionItem} from '../../question/question.classes';
import { MessageService} from '../../core/services';

const filesaver = require('file-saver');
declare var Materialize: any;

@Component({
  selector: 'qddt-concept-treenode',
  providers: [ {provide: 'elementKind', useValue: 'CONCEPT'}, ],
  templateUrl: './concept-tree-node.component.html',
  styleUrls: ['./concept-tree-node.component.css']
})

export class TreeNodeComponent implements AfterContentChecked {
  @Input() concept: Concept;
  @Input() readonly = false;
  @Output() deleteEvent =  new EventEmitter();
  @Output() updatedEvent =  new EventEmitter();

  public showConceptChildForm = false;
  public showbutton = false;

  public readonly canCreate: boolean;
  public readonly canUpdate: boolean;
  public readonly canDelete: boolean;

  private refreshCount = 0;

  constructor(private homeService: HomeService<Concept>, private message: MessageService) {
    homeService.qe = getQueryInfo(ElementKind.CONCEPT);
    this.canCreate = this.homeService.canDo.get(ActionKind.Create);
    this.canUpdate = this.homeService.canDo.get(ActionKind.Update);
    this.canDelete  = this.homeService.canDo.get(ActionKind.Delete);
    }

  ngAfterContentChecked(): void {
    if (this.refreshCount < 10) {
      try {
        this.refreshCount++;
        Materialize.updateTextFields();
      } catch (Exception) {}
    }
  }

  async onToggleEdit(edit) {
    edit.isVisible = !edit.isVisible;
    if (edit.isVisible) {
      this.refreshCount = 0;
      this.concept = await this.homeService.get(this.concept.id);
    }
  }

  onCreateConcept(concept: any) {
    if (!this.readonly) {
      this.readonly = concept.archived;
    }
    this.showConceptChildForm = !this.showConceptChildForm;
  }

  onConceptSavedEvent(concept: any) {
    this.concept.version = concept.version;
    this.updatedEvent.emit(concept);
  }

  onConceptUpdated(concept: any) {
    this.updatedEvent.emit(concept);
  }

  onDeleteConcept(concept: any) {
    this.deleteEvent.emit(concept);
  }

  onClickQuestionItem(cqi) {
    this.message.sendMessage( cqi );
  }
  onSelectQuestionItem(questionItem) {
    console.log('select question');
  }

  onChildSave(newchild) {

    this.showConceptChildForm = false;
    this.concept.children.push(new Concept(newchild));

    this.homeService.update(this.concept).subscribe((result: any) => this.concept = result );
  }

  removeQuestionItem(ref: IRevisionRef) {
    this.homeService.deattachQuestion(this.concept.id, ref.elementId , ref.elementRevision)
      .subscribe(result => this.onConceptSavedEvent(result) );
  }

  addQuestionItem(ref: ElementRevisionRef) {
    this.homeService.attachQuestion(this.concept.id, ref.elementId, ref.elementRevision)
      .subscribe(result => this.onConceptSavedEvent(result) );
  }

  getPdf(concept: Concept) {
    const fileName = concept.name + '.pdf';
    this.homeService.getPdf(concept).then(
      (data) => {
        filesaver.saveAs(data, fileName);
      });
  }

  getXml(concept: Concept) {
    const fileName = concept.name + '.xml';
    this.homeService.getXml(concept).then(
      (data) => {
        filesaver.saveAs(data, fileName);
      });
  }

}
