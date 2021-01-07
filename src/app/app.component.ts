import { Component, ViewEncapsulation, OnDestroy, AfterViewInit, LOCALE_ID, Inject } from '@angular/core';
import { IElement, IElementRef, IRevisionRef } from './lib';
import { MessageService, PropertyStoreService, UserService } from './lib/services';

// declare var $: any;


@Component({

  selector: 'qddt-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnDestroy, AfterViewInit {
  ref: IElementRef | IRevisionRef | IElement;

  constructor(private users: UserService, private properties: PropertyStoreService,
    private messages: MessageService, @Inject(LOCALE_ID) protected localID: string) {
    console.log(localID);
    messages.getMessage().subscribe({
      next: (aMessage) => this.onPreivewShow(aMessage)
    });

  }

  public ngAfterViewInit(): void {
    // M.AutoInit();
  }

  public ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.messages.getMessage().unsubscribe();
    // this.subscription.unsubscribe();
  }

  public isLoggedIn(): boolean {
    const isExpired = this.users.isTokenExpired();
    if (isExpired && this.users.loggedIn.getValue()) {
      this.users.loggedIn.next(false);
    }
    return !isExpired;
  }

  public onPreviewClose() {
    this.ref = null;
  }

  private onPreivewShow<T extends IElementRef | IRevisionRef | IElement>(element: T) {
    this.ref = element;
  }

}
