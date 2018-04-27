import { Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { QddtMessageService } from '../core/global/message.service';
import { QddtPropertyStoreService } from '../core/global/property.service';
import { PublicationService } from './publication.service';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { Page } from '../shared/classes/classes';
import { PublicationStatus } from './publication.classes';
import { IPageSearch } from '../shared/classes/interfaces';


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
      const published: string = this.getKey().get(this.KEY);
      this.selectId  = this.selectOptions.find( (s) => s.published === published).id;
    });
  }


  ngOnInit(): void {
    if (this.selectOptions) {
      const published: string = this.getKey().get(this.KEY);
      this.selectId  = this.selectOptions.find( (s) => s.published === published).id;
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
    const pageSearch = this.properties.get(this.path);
    pageSearch.keys = map;
    this.properties.set(this.path, pageSearch);
  }

  private getKey(): Map<string, string> {
    const pageSearch: IPageSearch =  this.properties.get(this.path);
      return pageSearch.keys;
  }

}
