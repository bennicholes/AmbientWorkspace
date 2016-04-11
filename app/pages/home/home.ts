import {Page, Alert, NavController} from 'ionic-angular'
import {NgZone} from 'angular2/core'
import {bridgeIp, HueService} from '../../services/hue'


@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [HueService]
})
export class HomePage {
  constructor(hueService: HueService, nav: NavController, ngZone: NgZone) {
    this.nav = nav
    this.hueService = hueService
    this.ngZone = ngZone
    this.getUser()
  }

  private getUser () : void {
    this.hueService.getUser()
      .then(user => {
        // wrap this in ngZone.run because otherwise angular isn't detecting changes...
        this.ngZone.run(() => {
          if (user) {
            this.connected = true
            this.getLights()
          } else {
            this.connected = false
          }
        })
      }, error => {
        console.warn('on error')
      })
  }
  private hueService: HueService
  private nav: NavController
  private ngZone: NgZone

  public bridgeIp: string = bridgeIp
  public lights = []
  public connected: boolean = false

  public createUser () {
    this.hueService.createUser()
      .subscribe(responses => {
        let response = responses[0]
        let alertMessage: string

        if (response.success) {
          this.connected = true
          this.getLights()
        } else if (response.error) {
          if (response.error.description === 'link button not pressed') { // might be better to check for 'type === 101'
            alertMessage = 'Press the link button on the bridge'
          } else {
            alertMessage = 'Error creating user'
          }
          let alert = Alert.create({
            title: 'Connect',
            subTitle: alertMessage,
            buttons: ['close']
          });
          this.nav.present(alert);
        }
      });
  }

  public getLights() {
    this.hueService.getLights()
      .subscribe(lights => {
        Object.keys(lights).forEach((key) => {
          console.log(lights[key])
          this.lights.push(lights[key])
        })
      })
  }

  public turnOn () {
    this.hueService.turnOnLights()
      .subscribe((response) => console.log('turn on lights', response))
  }

  public turnOff () {
    this.hueService.turnOffLights()
      .subscribe((response) => console.log('turn off lights', response))
  }
}
