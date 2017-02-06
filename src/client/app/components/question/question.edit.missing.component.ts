import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';
import { Subject } from 'rxjs/Subject';

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
  <div class="card hoverable">
    <div class="row">
      <div class="row"><span>Missing</span></div>
        <div class="row">
          <a *ngIf="!missing && !readonly"
            (click)="onAddMissing()"
            [ngClass]="{disabled:mainResponseDomain === null || mainResponseDomain === undefined}"
            class="btn-flat btn-floating btn-medium waves-effect waves-light teal">
            <i class="material-icons" title="response domain add">add</i>
          </a>
          <span *ngIf="missing">{{missing?.name}}</span>
        </div>
      <div class="modal" materialize [materializeActions]="missingAction">
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
          <button type="submit"
            class="btn btn-default green waves-green">Submit</button>
          <button id="questionItem-missing-modal-close"
            (click)="onDismiss()"
            class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
        </form>
      </div>
    </div>
  </div>
`
})

export class QuestionItemEditMissing implements OnInit {
  @Input() missing: any;
  @Input() readonly: boolean;
  @Input() mainResponseDomain: any;
  @Output() editMissing: EventEmitter<any>;
  missingCategories: any[];
  selectedCategoryIndex: number;
  missingAction = new EventEmitter<string>();
  private searchMissingCategoriesSubect: Subject<string> = new Subject<string>();

  constructor(private service: CategoryService) {
    this.editMissing = new EventEmitter<any>();
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
    this.editMissing.emit(null);
  }

  searchMissingCategories(name: string) {
    this.searchMissingCategoriesSubect.next(name);
  }

  select(candidate: any) {
    this.missing = candidate;
  }

  onAddMissing() {
    if(this.mainResponseDomain !== null && this.mainResponseDomain !== undefined) {
      this.missingAction.emit('openModal');
    }
  }

  onDismiss() {
    this.missing = null;
    return false;
  }

  onSave() {
    this.missingAction.emit('closeModal');
    if(this.missing !== null) {
      this.editMissing.emit(this.missing);
    }
  }
}
