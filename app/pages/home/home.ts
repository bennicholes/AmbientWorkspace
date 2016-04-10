import {Page, Alert, NavController} from 'ionic-angular';
import {Http} from 'angular2/http';
import {HueService} from '../../services/hue'


@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [HueService]
})
export class HomePage {
  constructor(http: Http, hueService: HueService, nav: NavController) {
    this.http = http;
    this.nav = nav;
    this.hueService = hueService;
  }

  private hueService: HueService;
  private http: Http;
  private nav: NavController;

  public makeGetRequest() {
    this.http.get("https://httpbin.org/ip")
      .subscribe(data => {
        var alert = Alert.create({
          title: "Your IP Address",
          subTitle: data.json().origin,
          buttons: ["close"]
        });
        this.nav.present(alert);
      }, error => {
        console.log(JSON.stringify(error.json()));
      });
  }
  public makePostRequest() {
    this.http.post("https://httpbin.org/post", "firstname=Denis")
      .subscribe(data => {
        var alert = Alert.create({
          title: "Data String",
          subTitle: data.json().data,
          buttons: ["close"]
        });
        this.nav.present(alert);
      }, error => {
        console.log(JSON.stringify(error.json()));
      });
  }

  public getBridges () {
    this.hueService.getBridges()
      .subscribe((data) => {
        let alert = Alert.create({
          title: 'Root get request',
          subTitle: JSON.stringify(data),
          buttons: ['close']
        });
        this.nav.present(alert);
      })
  }
}
