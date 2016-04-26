import {Page, Alert, NavController} from 'ionic-angular'
// import { Observable } from 'rxjs/Rx'
import {NgZone} from 'angular2/core'
import {HueService} from '../../services/hue'
import {WeatherService} from '../../services/weather'


@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [HueService, WeatherService]
})
export class HomePage {
  constructor(
    private hueService: HueService,
    private weatherService: WeatherService,
    private nav: NavController,
    private ngZone: NgZone
  ) {
     this.hueService
       .findBridges()
       .subscribe(bridges => {
         this.bridges = bridges
         this.selectedBridge = bridges[0]
       })
  }

  /** Whether the app is currently connected to a bridge */
  public connected: boolean = false

  /** IP of currently selected (and probably connected) bridge */
  public selectedBridge: string

  /** Loaded after bridge is connected */
  public bridges
  public lights
  public weather

  /** (User input) Zip Code */
  public zipCode

  /**
   * eventually probably take entire state as param instead
   * @param hue
     */
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

  // dear god forgive me I will refactor this later
  // yes this is a promise that sometimes returns an observable and sometimes doesn't :)
  public connect (bridgeIp: string): void {
    this.hueService.connect(bridgeIp)
      .then((request: any) => {
        this.ngZone.run(() => {
          // it only returns an observable if a user had to be created
          if (request.subscribe) {
            request.subscribe(response => {
              // user was created
              if (response.success) {
                this.connected = true
                this.getLights()
              } else if (response.error) {
                this.connected = false
                let alertMessage: string
                if (response.error.description === 'link button not pressed') { // might be better to check for 'type === 101'
                  alertMessage = 'Press the link button on the bridge'
                } else {
                  alertMessage = 'Error connecting to bridge'
                }
                let alert = Alert.create({
                  title: 'Connect',
                  subTitle: alertMessage,
                  buttons: ['close']
                })
                this.nav.present(alert)
              }
            })
          } else {
            this.connected = true
            this.getLights()
          }
        })
      },
      error => {
        console.error('error in connect promise, explicit function', error)
        error.subscribe(e => console.error(e))
      })
      .catch(error => {
        console.error('error in connect promise, catch', error)
      })
  }

  public getLights () {
    this.lights = []
    this.hueService.getLights()
      .subscribe(lights => {
        Object.keys(lights).forEach((key) => {
          this.lights.push(lights[key])
        })
      })
  }

  public getWeather (zipCode: number = 89434) {
    this.weatherService.getWeather(zipCode)
      .subscribe(weather => {
        console.log('Weather response', weather)
        this.weather = weather
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
