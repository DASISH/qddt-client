import {Component, Input} from 'angular2/core';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
 import {Change} from '../../common/change_status';

@Component({
  selector: 'responsedomain-form',
  moduleId: module.id,
  template: `<div >
    <div *ngIf="responsedomain" class="card" id="{{responsedomain.id}}"  >
      <form (ngSubmit)="save()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" [(ngModel)]="responsedomain.name" required>
            <label for="name" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea"  [(ngModel)]="responsedomain.description" required></textarea>
            <label for="description" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12"><label class="active teal-text">First Category</label><input type="text"></div>
        </div>
        <div *ngIf="responsedomain.changeKind" class="row">
           <div class="input-field col s4">
            <label class="active teal-text">Version Reason</label>
            <select [(ngModel)]="responsedomain.changeKind" materialize="material_select" required>
             <option value="" disabled selected>Select reason</option>
             <option *ngFor="#change of _ChangeEnums" [value]="change[0]">{{change[1]}}</option>
            </select>
          </div>
          <div class="input-field col s8">
            <input type="text" [(ngModel)]="responsedomain.changeComment" required>
            <label for="changeComment" class="active teal-text">Save Comment</label>
          </div>
        </div>
        <div *ngIf="responsedomain.authors" class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
            <div class="chip" *ngFor="#author of responsedomain.authors" >
              <img src="{{author.picture}}">{{author.name}} <i class="material-icons" (click)="removeAuthor(author.id)" >close</i>
            </div>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{responsedomain.modifiedBy.agency.name}}</div>
          </div>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>`,
  styles: [],
  pipes: [],
  directives: [MaterializeDirective]
})

export class ResponsedomainFormComponent {
  @Input() responsedomain: any;
  @Input() formType: string;
  private _ChangeEnums: any;
  constructor() {
    this._ChangeEnums = Change.status;
  }

}
