import {Page, Alert, NavController} from 'ionic-angular'
import {NgZone} from 'angular2/core'
import {bridgeIp, HueService} from '../../services/hue'
import {WeatherService} from '../../services/weather'


@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [HueService, WeatherService]
})
export class HomePage {
  constructor(hueService: HueService, weatherService: WeatherService, nav: NavController, ngZone: NgZone) {
    this.hueService = hueService
    this.weatherService = weatherService
    this.nav = nav
    this.ngZone = ngZone
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
        console.error('HopePage construct: error in getUser promise in ')
      })
  }
  private hueService: HueService
  private weatherService: WeatherService
  private nav: NavController
  private ngZone: NgZone

  // for now connected just means there is a user already stored in the app so we don't have to create a new one,
  // later will actually find bridge IPs and connect to bridge
  public connected: boolean = false
  public bridgeIp: string = bridgeIp
  public lights = []

  // eventually probably take entire state as param instead
  public changeColor (hue: number): void {
    // find first reachable light bulb
    // light bulb IDs start at 1
    let id: number = 1 + this.lights.findIndex(light => light.state.reachable)
    this.hueService
      .changeColor(id, {
        bri: 255,
        sat: 255,
        hue
      })
      .subscribe(response => console.log('change color', response))
  }

  /* Only called if the app didn't already store a user */
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
          })
          this.nav.present(alert)
        }
      })
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
