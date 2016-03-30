'use strict';

import { Page } from 'ionic-angular';
// import hue = require('node-hue-api');

@Page({
  templateUrl: 'build/pages/hue/hue.html',
})
export class Hue {
  private bridges: Array<Object>;
  constructor() {
    this.bridges = [];
  }

  public findBridges (): void {
    /*
    hue.nupnpSearch()
      .then((bridge: Object) => {
        console.log(`Hue Bridge Found: ${bridge}`);
        this.bridges.push(bridge);
      })
      .done();
    */
  }
}
