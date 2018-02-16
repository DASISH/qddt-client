import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


export enum HIERARCHY_POSITION {
  Survey,
  Study,
  Topic,
  Concept
}

/**
 *
 * In memmory store...
 */
@Injectable()
export class PropertyStoreService {

  currentChange$: Observable<HIERARCHY_POSITION>;
  // Observable navItem source
  private _newcurrent = new BehaviorSubject<HIERARCHY_POSITION>(HIERARCHY_POSITION.Survey);

  private current: string = null;

  private globalObjects: Map<string, any> = new Map();

  constructor() {
    this.currentChange$ = this._newcurrent.asObservable();
  }

  set(name: string, value: any) {
    this.globalObjects[name] = value;
  }

  get(name: string): any {
    return this.globalObjects[name] || '';
  }

  public setCurrent(pos: HIERARCHY_POSITION, name: string) {
    console.log('setCurrent ' + pos + ' - ' + name);
    this.current = name;
    this._newcurrent.next(pos);
  }

  public getCurrent(): any {
    return this.current;
  }


}
