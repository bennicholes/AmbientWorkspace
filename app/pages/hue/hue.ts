'use strict';

import { Page } from 'ionic-angular';
import { HueService } from 'services/hue';

@Page({
  templateUrl: 'build/pages/hue/hue.html',
  providers: [HueService]
})
export class Hue {
  private hueService: HueService;
  constructor(hueService: HueService) {
    this.hueService = hueService
  }

  public getUser () {
    this.hueService.createUser();
  }
}
