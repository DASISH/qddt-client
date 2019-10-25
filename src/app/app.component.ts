import {Component, ViewEncapsulation, OnDestroy, AfterViewInit} from '@angular/core';
import { IElement, IIdRef, IRevisionRef } from './lib';
import { MessageService, PropertyStoreService, UserService} from './lib/services';

// declare var $: any;


@Component({

  selector: 'qddt-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent  implements OnDestroy, AfterViewInit {
  ref: IIdRef|IRevisionRef|IElement;

  constructor(private users: UserService, private  properties: PropertyStoreService,
              private messages: MessageService ) {

    messages.getMessage().subscribe(
      (message) => this.showMessage(message),
      () => this.ref = null);

  }

  ngAfterViewInit(): void {
    M.AutoInit();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.messages.getMessage().unsubscribe();
    // this.subscription.unsubscribe();
  }

  isLoggedIn(): boolean {
    const isExpired = this.users.isTokenExpired();
    if (isExpired && this.users.loggedIn.getValue()) {
      this.users.loggedIn.next(false);
    }
    return !isExpired;
  }

  onClose() {
    // this.messages.getMessage().
  }

  private showMessage<T extends IIdRef|IRevisionRef|IElement>(element: T) {
    // this.subscription
    console.log('show preview');
    this.ref = element;
  }

  // private checkRouter(target: string, value: string) {
  //   const current = this.properties.get('current');
  //   if (current === target) {
  //     const config = this.properties.get('home');
  //     if (config.current !== value) {
  //       this.properties.set(target, {'current': value});
  //     }
  //   } else if (this.properties.get(target) === '') {
  //     this.properties.set(target, {'current': value});
  //   }
  //   this.properties.set('current', target);
  //
  // }


}
