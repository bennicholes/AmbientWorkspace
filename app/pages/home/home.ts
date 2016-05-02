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

  /** (User input) */
  public zipCode: number
  private lightsAreOn_: boolean = false
  get lightsAreOn (): boolean { return this.lightsAreOn_ }
  set lightsAreOn (x) { this.toggleLights() }
  public weatherIsActive: boolean = false
  public noticationsAreActive: boolean = false
  public nightShiftIsActive: boolean = false

  /**
   * Sends an "alert" to all the lights (they briefly dim in and out). Alerts only once if time
   * wasn't provided, otherwise alerts for a set amount of time.
   * @time [optional] How long to alert for in milliseconds. Alert only once if not set. E.g. 2000
   *   will alert for 2 seconds (and therefore make the lights dim in and out ~3 times).
     */
  public alert (time: number): void {
    if (!time) {
      // Alert only once
      this.hueService
        .updateLights({
          alert: "select"
        })
        .delay(1000)
        .subscribe(() => {
          // it seems like alert has to be manually cleared, even if it was a single alert
          this.hueService
            .updateLights({
              alert: "none"
            })
            .subscribe()
        })
    } else {
      // Alert for a set amount of time
      this.hueService
        .updateLights({
          alert: "lselect"
        })
        .delay(time)
        .subscribe(() => {
          this.hueService
            .updateLights({
              alert: "none"
            })
            .subscribe()
        })
    }
  }

  /**
   * Temporarily set all lights to a specified color. Timeout less than ~2000ms doesn't seem to work.
   * @hue
   * @timeout [optional] how long to flash a color for in ms, default 2000ms
   */
  public flash (hue: number, timeout: number = 2000): void {
    this.hueService
      .getLights()
      .subscribe(lights => {
        // assumes all lights have same state (color etc)
        let originalState = lights.find(light => light.state.reachable).state
        // flash color
        this.hueService
          .updateLights({
            bri: 255,
            sat: 255,
            hue
          })
          .delay(timeout)
          .subscribe(() => {
            // return to original state
            this.hueService
              .updateLights(originalState)
              .subscribe()
          })
      })
  }

  /**
   * Temporarily switches to a color then alerts a couple of times
   * @hue
   */
  public flashAlert (hue: number): void {
    this.flash(hue, 4000)
    setTimeout(() => {
      this.alert(2000)
    }, 1000)
  }

  /**
   * Retrieves lights and puts all the reachable lights in the front of the array (for UI purposes)
   */
  public getLights (): void {
    this.hueService.getLights()
      .subscribe((lights: [any]) => {
        // this sort probably shouldn't be done because it makes it difficult to get lightbulb ID
        this.lights = lights
          .sort((a, b): number => {
            // a < b
            if (a.state.reachable && !b.state.reachable) return -1
            // a > b
            else if (!a.state.reachable && b.state.reachable) return 1
            // a = b
            else return 0
          })

        // set default power state
        lights
          .filter(light => light.state.reachable)
          .forEach((light) => {
            if (light.state.on) {
              this.lightsAreOn_ = true
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

  /**
   * Change color of all the light bulbs. Should probably be named "setHue"
   * @param hue
   */
  public setHue(hue: number): void {
    this.hueService
      .updateLights({
        bri: 255,
        sat: 255,
        hue
      })
      .subscribe()
  }

  /**
   * Turns lights on/off
   */
  public toggleLights(): void {
    if (this.lightsAreOn_) {
      this.hueService.turnOffLights().subscribe()
    } else {
      this.hueService.turnOnLights().subscribe()
    }
    this.lightsAreOn_ = !this.lightsAreOn_
  }

  /**
   * Connect to specified bridge
   * TODO:
   *  dear god forgive me I will refactor this later
   *  yes this is a promise that sometimes returns an observable and sometimes doesn't :)
   * @param bridgeIp
   */
  public connect(bridgeIp: string): void {
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
}
