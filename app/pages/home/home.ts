import { Page, Alert, NavController } from 'ionic-angular'
import { NgZone } from 'angular2/core'
// import { Observable } from 'rxjs/Rx'
import { HueService } from '../../services/hue'
import { WeatherService } from '../../services/weather'

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [HueService, WeatherService]
})
export class HomePage {
  /**
   * Makes API call to find bridges. Initializes the first bridge as the selected bridge.
   * @param hueService
   * @param weatherService
   * @param nav
   * @param ngZone
     */
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

  /** IP of currently selected bridge. This is therefore the IP of the connect bridge. */
  public selectedBridge: string

  /** Loaded after bridge is connected */
  public bridges
  public lights
  public weather

  /** (User input) Zip Code */
  public zipCode: number
  public lightsAreOn: boolean = false

  /**
   * Change color of all the light bulbs. Should probably be named "setHue"
   * @param hue
     */
  public changeColor (hue: number): void {
    this.hueService
      .changeColor({
        bri: 255,
        sat: 255,
        hue
      })
      .subscribe(response => console.log('change color', response))
  }

  /**
   * Connect to specified bridge
   * TODO:
   *  dear god forgive me I will refactor this later
   *  yes this is a promise that sometimes returns an observable and sometimes doesn't :)
   * @param bridgeIp
     */
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
        console.error('error in connect promise', error)
        error.subscribe(e => console.error(e))
      })
      .catch(error => {
        console.error('error in connect promise caught', error)
      })
  }

  /**
   * Retrieves lights and puts all the reachable lights in the front of the array (for UI purposes)
   */
  public getLights (): void {
    this.hueService.getLights()
      .subscribe((lights: [any]) => {
        console.log(lights)
        this.lights = lights
          .sort((a, b): number => {
            if (a.state.reachable && !b.state.reachable) return -1 // a < b
            else if (!a.state.reachable && b.state.reachable) return 1 // a > b
            else return 0 // a = b
          })

        // set default power state
        lights
          .filter(light => light.state.reachable)
          .forEach((light) => {
            if (light.state.on) {
              this.lightsAreOn = true
            }
        })
      })
  }

  /**
   * Get weather from API
   * @param zipCode
     */
  public getWeather (zipCode: number = 89557): void {
    this.weatherService.getWeather(zipCode)
      .subscribe(weather => {
        console.log('Weather response', weather)
        this.weather = weather
      })
  }

  public toggleLights(): void {
    if (this.lightsAreOn) {
      this.turnOff()
    } else {
      this.turnOn()
    }
    this.lightsAreOn = !this.lightsAreOn
  }

  /**
   * Turn on all lights
   */
  private turnOn (): void {
    this.hueService.turnOnLights().subscribe()
  }

  /**
   * Turn off all lights
   */
  private turnOff (): void {
    this.hueService.turnOffLights().subscribe()
  }

  public copyrightAlert() {
    let alert = Alert.create({
      title: 'Information',
      subTitle: 'Created By: Denis Morozov, Ben Nicholes, Saharath Kleips. ©Ambient Workspace 2016',
      buttons: ['OK']
    });
    this.nav.present(alert);
  }
}
