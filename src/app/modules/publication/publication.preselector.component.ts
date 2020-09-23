import { Component, OnInit } from '@angular/core';
import { ActionKind, ElementKind, IPageSearch, PageSearch, PublicationService, PublicationStatus } from '../../lib';
import { MessageService, PropertyStoreService } from '../../lib/services';


@Component({
  selector: 'qddt-publication-preselector',
  styles: ['.row { margin-bottom: auto; }'],
  template: `
  <div style="padding-top: 1rem;">
    <div class="row">
    <div class="col left" *ngFor="let option of selectOptions; let idx=index;" >
      <label>
        <input name="DOMAIN-TYPE-GROUP" type="radio" [checked]="selectId === option.id" (click)="onSelectOption(idx)" />
        <span class="white-text">{{ option.label }}</span>
      </label>
    </div>
  </div>
</div>` ,
})

export class PublicationPreselectorComponent implements OnInit {

  public selectOptions: PublicationStatus[];
  public selectId = 0;
  private readonly path = 'publications';
  private readonly KEY = 'publishedKind';

  constructor(private messages: MessageService, private properties: PropertyStoreService,
    private service: PublicationService) { }

  async ngOnInit() {
    this.selectOptions = await this.service.getPublicationStatus();
    this.selectId = this.getPublished().id;
  }

  public onSelectOption(id: number) {
    const pageSearch = this.getPageSearch();
    this.selectId = id;
    pageSearch.keys.set(this.KEY, this.selectOptions[id].published);
    this.setPageSearch(pageSearch);
    this.messages.sendAction({ id: this.KEY, action: ActionKind.Filter, object: null });
  }

  private getPublished(): PublicationStatus {
    const page = this.getPageSearch();
    return (page.keys.has(this.KEY)) ?
      this.selectOptions.filter(f => f.published === page.keys.get(this.KEY))[0] :
      this.selectOptions[0];
  }

  private setPageSearch(pageSearch: IPageSearch) {
    this.properties.set(this.path, pageSearch);
  }

  private getPageSearch(): IPageSearch {
    return (this.properties.get(this.path) || new PageSearch({ kind: ElementKind.PUBLICATION })) as IPageSearch;
  }

}
