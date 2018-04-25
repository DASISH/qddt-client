import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { QddtMessageService } from '../core/global/message.service';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { QddtPropertyStoreService } from '../core/global/property.service';
import { Page } from '../shared/classes/classes';
import {PublicationService, PublicationStatus} from './publication.service';

@Component({
  selector: 'qddt-publication-preselector',
  moduleId: module.id,
  template: `
  <div class="card-action">
    <div class="row">
    <div class="col left" *ngFor="let option of selectOptions" >
      <input name="domaintypegroup" type="radio" id="domain{{option.id}}"
        (click)="onSelectOption(option.id)" [checked]="selectId === option.id"/>
      <label class="white-text" for="domain{{option.id}}" >{{ option.label }}</label>
    </div>
  </div>
</div>` ,
providers: []
})
export class PublicationPreselectorComponent implements OnChanges, OnInit {

  public selectOptions: PublicationStatus[];
  public selectId = 0;
  private readonly path = 'publications';
  private readonly KEY = 'publishedstatus';

  constructor(private  messages: QddtMessageService, private properties: QddtPropertyStoreService,
              private service: PublicationService) {
    this.service.PUBLICATION_STATUSES.then( (result) => {
      this.selectOptions = result;
      this.selectId = this.selectOptions[0].id;
    });
  }


  ngOnInit(): void {
    if (this.selectOptions) {
      this.selectId = this.selectOptions[0].id;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes[''])
  }

  onSelectOption(id: number) {
    this.selectId = id;
    this.setKey(new Map( [ [this.KEY, this.selectOptions[id].published ] ] ));
    this.messages.sendAction( { id: this.KEY,  action: ActionKind.Filter, object: this.getKey() } );
  }

  private setKey(map: Map<string, string> ) {
    let pageSearch = this.properties.get(this.path);
    if (!pageSearch) {
      pageSearch = {kind: ElementKind.PUBLICATION, key: '*', page: new Page(), sort: 'modified,desc'};
    }
    pageSearch.keys = map;
    this.properties.set(this.path, pageSearch);
  }

  private getKey(): Map<string, string> {
    const pageSearch = this.properties.get(this.path);
    if (pageSearch.keys ) {
      return pageSearch.keys;
    }
    return new Map( [ [this.KEY, 'NOT_PUBLISHED' ] ] );
  }

}


