import {Page, Alert, NavController} from 'ionic-angular';
import {HueService} from '../../services/hue'


@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [HueService]
})
export class HomePage {
  constructor(hueService: HueService, nav: NavController) {
    this.nav = nav;
    this.hueService = hueService;
  }

  private hueService: HueService;
  private nav: NavController;

  public getBridges () {
    this.hueService.test()
      .subscribe((data) => {
        let alert = Alert.create({
          title: 'Root get request',
          subTitle: JSON.stringify(data),
          buttons: ['close']
        });
        this.nav.present(alert);
      }, error => {
        console.error(JSON.stringify(error.json()));
      })
  }
}
