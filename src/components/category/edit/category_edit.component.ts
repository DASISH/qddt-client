import {Component, Input} from 'angular2/core';

import {CategoryService, Category} from '../category.service';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {Change} from '../../../common/change_status';

@Component({
  selector: 'category-edit',
  moduleId: module.id,
  providers: [CategoryService],
  directives: [MaterializeDirective],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="category" class="card" id="{{category.id}}"  >
      <form (ngSubmit)="onSave()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" [(ngModel)]="category.name" required>
            <label for="name" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" [(ngModel)]="category.label" required>
            <label for="label" class="active teal-text">Label</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea"  [(ngModel)]="category.description" required></textarea>
            <label for="description" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s5">
            <label class="active teal-text">Type of Change</label>
            <select [(ngModel)]="category.changeKind" materialize="material_select" required>
              <option value="" disabled selected>Select reason</option>
              <option *ngFor="#change of _ChangeEnums" [value]="change[0]">{{change[1]}}</option>
            </select>
          </div>
          <div class="input-field col s7">
            <label for="changeComment" class="active teal-text">Reason for change</label>
            <input id="changeComment" type="text" [(ngModel)]="category.changeComment" required>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
            <div class="chip" *ngFor="#author of category.authors" >
              <img src="{{author.picture}}">{{author.name}} <i class="material-icons">close</i>
            </div>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{category.modifiedBy.agency.name}}</div>
          </div>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>
`
})

export class CategoryEditComponent {

  @Input() category: Category;

  private _ChangeEnums: any;

  constructor(private categoryService: CategoryService) {
    this._ChangeEnums = Change.status;
  }

  onSave() {
      this.categoryService.edit(this.category)
        .subscribe(result => {
        this.category = result;
      });
  }

}
