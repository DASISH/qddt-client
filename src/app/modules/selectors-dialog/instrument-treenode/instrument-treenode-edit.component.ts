import { NgForm } from '@angular/forms';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  toSelectItems, Loop, ConditionConstruct, ElementKind,
  ConditionKind, TemplateService, ActionKind, hasChanges, isString,
  IfThenElse, TreeNodeRevisionRefImpl, ICondition, AbstractControlConstruct, mergeParameters, refreshParameter
} from 'src/app/lib';



@Component({
  selector: 'qddt-edit-conditional',
  template: `
<ul *ngIf="conNode" class="row">
  <form [id]="'ECC'+formId" #hf="ngForm" [parentFormConnect]="formName" >
    <!-- <li class="col s9">
      <qddt-input required name="name" label="Label" [(ngModel)]="conNode.name" data-length="100">
      </qddt-input>
    </li> -->
    <li >
      <ng-container [ngSwitch]="conNode.element.conditionKind">
        <ng-container *ngSwitchCase="'IF_THEN_ELSE'">
          <qddt-if-then-else-form [(element)]=conNode.element.condition [formName]="'IFTHENELSE'" (change)="doCheckParam()" ></qddt-if-then-else-form>
        </ng-container>
        <ng-container *ngSwitchCase="'LOOP'">
          <qddt-for-each-form [(element)]=conNode.element.condition [formName]="'LOOP'"></qddt-for-each-form>
        </ng-container>
      </ng-container>
    </li>
  </form>
</ul>
`,
})

export class TreeNodeEditComponent implements OnChanges {
  @Input() conNode: TreeNodeRevisionRefImpl<ConditionConstruct>;
  @Input() formName: string;
  @Input() readonly = false;
  @Output() modifiedEvent = new EventEmitter<ConditionConstruct>();

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly CONDITION = ElementKind.CONDITION_CONSTRUCT;
  public readonly CONDITION_KIND_MAP = toSelectItems(ConditionKind);
  public foreach: boolean;


  constructor(private service: TemplateService) {
    this.readonly = !this.service.can(ActionKind.Create, ElementKind.CONDITION_CONSTRUCT);
  }


  public ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.conNode)) {
      this.doCheck(changes.conNode.currentValue);
      mergeParameters(changes.conNode.currentValue);
      // const conditional = JSON.parse(changes.conNode.currentValue.name) as ICondition;
      // this.conNode.element = conditional;
      // this.conNode.name = this.conNode.element.name;
    }

  }

  public doCheckParam() {
    refreshParameter(this.conNode);
    if (this.conNode.element.conditionKind) {
      // const ifthenelse = this.conNode.element.condition as IfThenElse;
    }
  }

  public doCheck(node: TreeNodeRevisionRefImpl<ConditionConstruct>) {
    switch (node.element.conditionKind) {
      case ConditionKind.IfThenElse:
        if (isString(node.element.condition)) {
          console.debug('do check init ifthenelse');
          node.element.condition = new IfThenElse(JSON.parse(node.element.condition))
        }
        break;
      case ConditionKind.Loop:
        if (isString(node.element.condition)) {
          node.element.condition = new Loop(JSON.parse(node.element.condition));
        }
        break;
      default:
        console.debug('This kind isn\'t implemented yet; ' + node.element.conditionKind);
    }
    // JSON.stringify(node.element.condition).match
  }

  public onSave() {

    // this.condition.condition = JSON.stringify(this.condition.condition);
    //   this.service.update < TreeNodeRevisionRefImpl<ICondition>(this.condition).subscribe(
    //     (result) => {
    //       this.condition = new ConditionConstruct(result);
    //       this.modifiedEvent.emit(result);
    //     },
    //     (error) => { throw error; });
    // }

  }


  public isLoop(condition: any | Loop): condition is Loop {
    return (condition) && (condition as Loop).loopWhile !== undefined;
  }

}
