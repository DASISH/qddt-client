import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';

@Component({
  selector: 'qddt-questionitem-edit-missing',
  moduleId: module.id,
  providers: [CategoryService],
  styles: [
    `.minHeight {
       min-height: 400px;
       height: auto;
    }`
  ],
  template:
  `
  <div class="hoverable">
    <div class="row"
      (mouseenter)="showbutton = true"
      (mouseleave)="showbutton = false">
      <div class="row teal-text"><span>Missing</span></div>
        <div class="row">
          <a *ngIf="!missing && !readonly"
            [ngClass]="{hide: !showbutton}"
            (click)="onAddMissing()"
            [ngClass]="{disabled:mainResponseDomain === null || mainResponseDomain === undefined}"
            class="btn-flat btn-floating btn-medium waves-effect waves-light teal">
            <i class="material-icons" title="response domain add">add</i>
          </a>
          <span *ngIf="missing">{{missing?.name}}</span>
        </div>
      <div class="modal" materialize="modal" [materializeActions]="missingAction">
        <form (ngSubmit)="onSave()" #missingForm="ngForm">
        <div class="modal-content minHeight">
          <div class="row">
            <autocomplete [items]="missingCategories" class="black-text"
              [searchField]="'label'"
              (autocompleteFocusEvent)="selectedCategoryIndex=idx;"
              [initialValue]="''"
              [searchFromServer]="true"
							(enterEvent)="searchMissingCategories($event)"
              (autocompleteSelectEvent)="select($event)"></autocomplete>
          </div>
          <table *ngIf="missing">
						<thead><tr><td>Code</td><td>Category</td></tr></thead>
						<tbody>
							<tr *ngFor="let category of missing.children; let idx=index">
								<td><input id="{{category?.id}}-code-value"
                  name="{{category?.id}}-code-value"
                  type="text" [(ngModel)]="category.code.codeValue" required></td>
								<td>
									{{category?.label}}
								</td>
							</tr>
						</tbody>
					</table>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-default green waves-green">Submit</button>
          <button id="questionItem-missing-modal-close" (click)="onDismiss()"
            class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
        </form>
      </div>
    </div>
  </div>
`
})

export class QuestionItemEditMissingComponent implements OnInit {
  @Input() missing: any;
  @Input() mainResponseDomain: any;
  @Input() readonly: boolean;
  @Output() missingSelectedAction: EventEmitter<any>;
  showbutton: any;
  missingCategories: any[];
  selectedCategoryIndex: number;
  missingAction = new EventEmitter<string|MaterializeAction>();
  private searchMissingCategoriesSubect: Subject<string> = new Subject<string>();

  constructor(private service: CategoryService) {
    this.missingSelectedAction = new EventEmitter<any>();
    this.selectedCategoryIndex = 0;
    this.missingCategories = [];
    this.searchMissingCategoriesSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.getAllTemplatesByCategoryKind('MISSING_GROUP', name).subscribe((result: any) => {
          this.missingCategories = result.content;
        });
      });
  }

  ngOnInit() {
    if(this.readonly === null || this.readonly === undefined) {
      this.readonly = false;
    }
  }

  onRemoveMissingResponsedomain(questionitem: any) {
    this.missingSelectedAction.emit(null);
  }

  searchMissingCategories(name: string) {
    this.searchMissingCategoriesSubect.next(name);
  }

  select(candidate: any) {
    this.missing = candidate;
  }

  onAddMissing() {
    if(this.mainResponseDomain) {
      this.missingAction.emit({action:'modal', params:['open']});
    }
  }

  onDismiss() {
    this.missing = null;
    return false;
  }

  onSave() {
    this.missingAction.emit({action:'modal', params:['close']});
    if(this.missing) {
      this.missingSelectedAction.emit(this.missing);
    }
  }
}
