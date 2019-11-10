import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HierarchyPosition} from '../enums';
import { MenuItem} from '../interfaces';
import { UserSettings} from '../classes';

/**
 *
 * In memory store...
 */
@Injectable()
export class PropertyStoreService {
  private static readonly USER_SETTINGS = 'USER_SETTINGS';
  private static readonly PATH = 'PATH';

  currentChange$: BehaviorSubject<HierarchyPosition>;

  private globalObjects: Map<string, any> = new Map();
  private path = new Array<MenuItem>(4);
  private readonly userSettings: UserSettings;


  constructor() {
    try {
      this.path = JSON.parse(localStorage.getItem(PropertyStoreService.PATH)) || this.path;
      this.userSettings = new UserSettings(JSON.parse(localStorage.getItem(PropertyStoreService.USER_SETTINGS)));
      const pos = this.userSettings.hierarchyPosition || HierarchyPosition.Survey;
      this.currentChange$ = new BehaviorSubject<HierarchyPosition>(pos);
    } catch (e) {
      console.log(e);
    }
  }


  set(key: string, value: any) {
    this.globalObjects.set(key, value);
  }

  get(key: string): any {
    return this.globalObjects.get(key) || '';
  }

  has(key: string): boolean {
    return this.globalObjects.has(key);
  }

  get userSetting(): UserSettings {
    return this.userSettings;
  }

  get parentMenu(): MenuItem {
    return this.menuPath[this.currentChange$.getValue() - 1];
  }


  get menuPath(): Array<MenuItem> {
    return this.path;
  }

  public pathClear(pos: HierarchyPosition) {
     this.path = this.path.filter( (f, i) => i < pos);
     localStorage.setItem(PropertyStoreService.PATH, JSON.stringify(this.menuPath));
     this.userSetting.hierarchyPosition = pos;
     this.currentChange$.next(pos);
    }

  public setCurrentMenu(pos: HierarchyPosition, item: MenuItem) {
    this.menuPath[pos] = item;
    localStorage.setItem(PropertyStoreService.PATH, JSON.stringify(this.menuPath));
    this.userSetting.hierarchyPosition = pos;
    this.userSetting.save();
    this.currentChange$.next(pos);
  }


}
