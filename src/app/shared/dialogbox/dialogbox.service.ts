import { Component, Injectable, } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QddtModalComponent } from './dialogbox.component';

@Injectable()
export class QddtModalService {
  map: Map<string, QddtModalComponent> = new Map();

  get(key: string): QddtModalComponent {
    return this.map.get(key);
  }

  set(key: string, modal: QddtModalComponent): void {
    this.map.set(key, modal);
  }
}
