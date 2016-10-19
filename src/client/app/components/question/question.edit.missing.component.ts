import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService } from '../category/category.service';

@Component({
  selector: 'qddt-questionitem-edit-missing',
  moduleId: module.id,
  providers: [CategoryService],
  template:
  `
  <div class="card">
    <div class="row">
      <div class="row"><span>Missing</span></div>
        <div class="row">
          <a materialize="leanModal" [materializeParams]="[{dismissible: true}]"
            class="modal-trigger btn-flat btn-floating btn-medium waves-effect waves-light teal"
            [attr.href]="'#' + questionitem.id + '-edit-missing-modal'">
            <i class="material-icons" title="response domain edit">mode_edit</i>
          </a>
          <a class="btn-flat btn-floating btn-medium waves-effect waves-light teal"
            (click)="onRemoveMissingResponsedomain(questionitem)">
            <i class="material-icons left medium" title="remove missing response domain">remove</i>
          </a>
        </div>
      <div [attr.id]="questionitem.id + '-edit-missing-modal'" class="modal">
        <form (ngSubmit)="onSave()" #missingForm="ngForm">
        <div class="modal-content">
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
            class="btn btn-default red modal-action modal-close waves-effect waves-red">Dismiss</button>
        </div>
        </form>
      </div>
    </div>
  </div>
`
})

export class QuestionItemEditMissing implements OnInit {
  @Input() questionitem: any;
  @Output() editMissing: EventEmitter<any>;
  missingCategories: any[];
  selectedCategoryIndex: number;
  missing: any;

  constructor(private service: CategoryService) {
    this.editMissing = new EventEmitter<any>();
    this.selectedCategoryIndex = 0;
    this.missingCategories = [];
  }

  ngOnInit() {
    this.service.getAllTemplatesByCategoryKind('MISSING_GROUP').subscribe((result: any) => {
      this.missingCategories = result.content;
    });
    let children: any[];
    try {
      children = this.questionitem.responseDomain.managedRepresentation.children || [];
    } catch (e) {
      children = [];
    }
    this.missing = children.find((c:any) => c.categoryType === 'MISSING_GROUP');
  }

  onRemoveMissingResponsedomain(questionitem: any) {
    this.editMissing.emit(null);
  }

  searchMissingCategories(name: string) {
    this.service.getAllTemplatesByCategoryKind('MISSING_GROUP', name).subscribe((result: any) => {
      this.missingCategories = result.content;
    });
  }

  select(candidate: any) {
    this.missing = candidate;
  }

  onSave() {
    if(this.missing !== null) {
      this.editMissing.emit(this.missing);
      document.getElementById('questionItem-missing-modal-close').click();
    }
  }
}
