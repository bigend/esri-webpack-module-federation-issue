import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  compNames = '';

  constructor() {
    console.log("--- SharedService constructor hit ---");

  }

  setComponent(componentName: string) {
    this.compNames += componentName + ' ';
    console.log("SharedServiceComonents: " + this.compNames);
  }


}
