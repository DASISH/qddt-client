import { Injectable } from '@angular/core';

@Injectable()
export class UserService {

  user: string;
  private globalObjects: any;

  constructor() {
    this.user = localStorage.getItem('user');
    this.globalObjects = {};
  }

  get() : any {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch(e) {
      this.user = null;
      return null;
    }
  }

  set(user: string) : string {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = JSON.stringify(user);
    return this.user;
  }

  remove() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    this.user = null;
  }

  setGlobalObject(name: string, value: any) {
    this.globalObjects[name] = value;
  }

  getGlobalObject(name: string) {
    return this.globalObjects[name] || '';
  }
}
