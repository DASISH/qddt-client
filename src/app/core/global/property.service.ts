import {Injectable, OnDestroy} from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import {MenuItem} from '../../menu/menu.component';


export enum HIERARCHY_POSITION {
  None,
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
export class QddtPropertyStoreService {

  currentChange$: Observable<HIERARCHY_POSITION>;
  // Observable navItem source
  private _newcurrent: BehaviorSubject<HIERARCHY_POSITION>;
  private globalObjects: Map<string, any> = new Map();
  private _path = new Array<MenuItem>(4);

  constructor() {

    this._path = JSON.parse(localStorage.getItem('PATH')) || this._path;
    const pos = +localStorage.getItem('HIERARCHY_POSITION') || HIERARCHY_POSITION.Survey;

    this._newcurrent = new BehaviorSubject<HIERARCHY_POSITION>(pos);
    this.currentChange$ = this._newcurrent.asObservable();
  }


  set(key: string, value: any) {
    this.globalObjects.set(key, value);
  }

  get(key: string): any {
    return this.globalObjects.get(key) || '';
  }

  get current(): MenuItem {
    return this.menuPath[this._newcurrent.getValue()];
  }

  public setCurrent(pos: HIERARCHY_POSITION, item: MenuItem) {
    this._path[pos - 1] = item;
    localStorage.setItem('PATH', JSON.stringify(this.menuPath));
    localStorage.setItem('HIERARCHY_POSITION', pos.toString());
    this._newcurrent.next(pos);
  }

  get menuPath(): Array<MenuItem> {
    return this._path;
  }



}
