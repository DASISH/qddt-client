import { Component, Input, OnInit } from '@angular/core';

import { DomainType, DomainTypeDescription } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';

@Component({
  selector: 'qddt-responsedomain-usedby',
  moduleId: module.id,
  template: `
  <div *ngIf="id && responsedomain" class="row">
    <div class="card">
      <h4>Responsedomain</h4>
      <label>Version: {{responsedomain?.version?.major}}.{{responsedomain?.version?.minor}}</label>
			<div class="row">
				<div class="col s12">
					<label for="name-readonly" class="active teal-text">Name</label>
					<input id="name-readonly" name="name-readonly" type="text"
          [ngModel]="responsedomain.name" readonly>
				</div>
			</div>
			<div class="row">
				<div class="col s12">
					<label for="description-readonly" class="active teal-text">Description</label>					
					<textarea class="materialize-textarea"
					  id="description-readonly" name="description-readonly"
						[ngModel]="responsedomain.description" readonly>
          </textarea>
				</div>
			</div>
			<div class="row">
				<div [ngSwitch]="domainType">
					<div *ngSwitchCase="domainTypeDef.SCALE">
						<div class="row">
              <div class="col s4">
                <label for="scale_start-readonly" class="active">Start</label>
                <input id="scale_start-readonly" name="scale_start-readonly" type="number"
					        [ngModel]="responsedomain.managedRepresentation.inputLimit.minimum" readonly>
              </div>
              <div class="col s4">
                <label for="scale_end-readonly" class="active">End</label>
                <input id="scale_end-readonly" name="scale_end-readonly" type="number"
					        [ngModel]="responsedomain.managedRepresentation.inputLimit.maximum" readonly>
              </div>
							<div class="col s4 input-field">
							  <label for="scale_DisplayLayout-readonly" class="active">Display Layout</label>
								<select id="scale_DisplayLayout-readonly"
                  name="scale_DisplayLayout-readonly"
								  [ngModel]="responsedomain.displayLayout"
						      materialize="material_select" readonly>
						      <option [value]="0">horizontal</option>
						      <option [value]="90">vertical</option>
   					    </select>
						  </div>
            </div>

						<div class="row">
							<div class="col s4">
							  <label for="scale_anchor-readonly" class="active">Number of Anchor</label>
							  <input id="scale_anchor-readonly" name="scale_anchor-readonly" type="number"
                  [ngModel]="numberOfAnchors"
								  readonly>
							</div>
						</div>

						<table *ngIf="numberOfAnchors > 0">
						  <thead><tr><td>Code</td><td>Category</td></tr></thead>
							<tbody>
								<tr *ngFor="let category of responsedomain.managedRepresentation.children; let idx=index">
									<td><input name="{{idx}}-code-value-readonly" type="text"
                  [ngModel]="category.code.codeValue" readonly></td>
									<td>
										<div>{{category?.label}}</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div *ngSwitchCase="domainTypeDef.LIST" class="row">
						<div class="col s2 input-field">
							<input id="code_number-readonly" name="code_number-readonly" type="number"
							  min="0"
							  [ngModel]="responsedomain.managedRepresentation.inputLimit.maximum"
								readonly>
							<label for="code_number-readonly" class="active">Number of Codes</label>
						</div>

						<table *ngIf="responsedomain.managedRepresentation.inputLimit.maximum > 0">
						  <thead><tr><td>Code</td><td>Category</td></tr></thead>
							<tbody>
								<tr *ngFor="let category of responsedomain.managedRepresentation.children; let idx=index">
									<td><input name="{{idx}}-code-value-readonly" type="text"
                    [ngModel]="category.code.codeValue" readonly></td>
									<td>
                    {{category?.label}}
									</td>
								</tr>
							</tbody>
						</table>
						<div *ngIf="responsedomain.managedRepresentation.inputLimit.maximum > 0" class="row card">
							<div class="row input-field col s5">
							  <input id="responseCardinality_minimum-readonly"
                  name="responseCardinality_minimum-readonly" type="number"
							    [ngModel]="responsedomain.responseCardinality.minimum" readonly>
							  <label for="responseCardinality_minimum-readonly">Min of Response Cardinality</label>
						  </div>
							<div class="row input-field col s5">
							  <input id="responseCardinality_maximum-readonly"
                  name="responseCardinality_maximum-readonly" type="number"
							    [ngModel]="responsedomain.responseCardinality.maximum" readonly>
							  <label for="responseCardinality_maximum-readonly">Max of Response Cardinality</label>
						  </div>							
						</div>
					</div>
					<div *ngSwitchCase="domainTypeDef.NUMERIC">
						<table *ngIf="responsedomain.managedRepresentation">
						  <thead><tr><td>Numeric Range</td><td>Value</td></tr></thead>
							<tbody>
								<tr>
								  <td><label>Low</label></td>
								  <td><input id="representation_low-readonly"
                    name="representation_low-readonly" type="text"
                    [ngModel]="responsedomain.managedRepresentation.inputLimit.minimum" readonly></td>
								</tr>
								<tr>
								  <td><label>High</label></td>
								  <td><input id="representation_high-readonly"
                    name="representation_high-readonly" type="text"
                    [ngModel]="responsedomain.managedRepresentation.inputLimit.maximum" readonly></td>
								</tr>
							</tbody>
						</table>
					</div>
					<div *ngSwitchCase="domainTypeDef.TEXT">
						<table *ngIf="responsedomain.managedRepresentation">
						  <thead><tr><td>TEXT Range</td><td>Value</td></tr></thead>
							<tbody>
								<tr>
								  <td><label>Minimum length</label></td>
								  <td><input id="text_representation_min-readonly"
                    name="text_representation_min-readonly" type="number"
                    [ngModel]="responsedomain.managedRepresentation.inputLimit.minimum" readonly></td>
								</tr>
								<tr>
								  <td><label>Maximum length</label></td>
								  <td><input id="text_representation_max-readonly"
                    name="text_representation_max-readonly" type="number"
                    [ngModel]="responsedomain.managedRepresentation.inputLimit.maximum" readonly></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="row">
        <div class="input-field col s8">
          <p><label class="active teal-text">Authors</label></p>
          <qddt-author-chip [authors]="responsedomain.authors"></qddt-author-chip>
        </div>
        <div class="input-field col s4">
          <p><label class="active teal-text">Agency</label></p>
          <div class="chip" >{{responsedomain?.modifiedBy?.agency?.name}}</div>
        </div>
      </div>
		</div>
 </div>
  `,
  providers: [ResponseDomainService],
})
export class ResponsedomainUsedbyComponent implements OnInit {
	@Input() id: string;
  @Input() domainType: DomainType;
  numberOfAnchors: number;
  domainTypeDef = DomainType;
  responsedomain: any;
  constructor(private service: ResponseDomainService) {}

	ngOnInit() {
		this.numberOfAnchors = 0;
		this.service.getResponseDomain(this.id).subscribe((result: any) => {
			this.responsedomain = result;
			if (this.domainType === DomainType.SCALE || this.domainType === DomainType.LIST) {
				this.numberOfAnchors = this.responsedomain.managedRepresentation.children.length;
			}
			if (this.domainType === null || this.domainType === undefined) {
				this.domainType = DomainTypeDescription.find(e=>e.name === this.responsedomain['responseKind']).id;
			}
		});
	}

}
