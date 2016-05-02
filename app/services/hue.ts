import { Storage, SqlStorage } from 'ionic-angular'
import { Injectable } from 'angular2/core'
import { Http, Response } from 'angular2/http'
import { Observable } from 'rxjs/Rx'
import 'rxjs/operator/map'

/* For outside API requests will probably need options
 import { Headers, RequestOptions } from 'angular2/http'
 private headers = new Headers({ 'Content-Type': 'application/json' })
 private options = new RequestOptions({ headers: headers })
 */

@Injectable()
export class HueService {
  constructor (private http: Http) {
    this.storage = new Storage(SqlStorage)
  }

  private storage: Storage
  private bridgeIp: string
  private user: string
  /*
   /lights resource which contains all the light resources
   /groups resource which contains all the groups
   /config resource which contains all the configuration items
   /schedules which contains all the schedules
   /scenes which contains all the scenes
   /sensors which contains all the sensors
   /rules which contains all the rules
  */
  get bridgeUrl () {
    return `http://${this.bridgeIp}/api/`
  }
  private lightsUrl: string = '/lights/'

  /*
    Public methods
   */

  /**
   * Connects to specified bridge
   * TODO: refactor
   * @param bridgeIp
   * @returns {Promise<T>|Promise<R>|Promise}
     */
  public connect (bridgeIp: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this.storage
        .get(bridgeIp)
        .then(username => {
          console.log('retrieved username attempt', username)
          this.bridgeIp = bridgeIp
          if (username) {
            this.user = username
            resolve({}) // hehe why not you know
          } else {
            resolve(this.createUser(bridgeIp))
          }
        })
    })
  }

  /**
   * Updates color of all lights
   * @param state {hue, sat, bri, on}
   * @returns {Observable<{}>}
     */
  public changeColor (state: {}): Observable<{}> {
    // http://www.developers.meethue.com/documentation/core-concepts
    return this.put(this.user + '/groups/0/action', state)
  }

  /**
   * Might need to clean up all the users I've created...
   * @param username that is to be deleted
   * @returns {Observable<{}>}
     */
  public deleteUser (username: string): Observable<{}> {
    return this.delete(this.user + '/config/whitelist/' + username)
  }

  /**
   * Response from this api is array of bridges that each have id (ex: "001788fffe262be0") and internalipaddress
   * TODO: This should also do UPNP and IP scan either in parallel or if NUPNP doesn't return anything (not priority)
   * @returns {Observable<[string]>} bridge ip addresses
     */
  public findBridges () {
    return this.http
      .get('https://www.meethue.com/api/nupnp')
      .map(response => response.json())
      .map(bridges => bridges.map(bridge => bridge.internalipaddress))
      .catch(this.handleError)
  }

  /**
   * Returns the entire bridge state including lights, group, config, etc.
   * Resource intensive for the bridge.
   * http://www.developers.meethue.com/documentation/configuration-api#75_get_full_state_datastore
   * @returns {Observable<{}>} the request
   */
  public getBridgeState (): Observable<{}> {
    return this.get(this.user)
  }

  /**
   * Returns an array of lights
   * @returns {Observable<[any]>}
     */
  public getLights (): Observable<any[]> {
    return this.get(this.user + this.lightsUrl)
      .map(lights => {
        return Object.keys(lights).map(key => lights[key])
      })
  }

  public getLight (id: number): Observable<{}> {
    return this.get(this.user + this.lightsUrl + id)
  }

  /**
   * I wonder if this returns the default scenes? I wonder if the "flux" mode is a default scene?
   * @returns {Observable<{}>}
     */
  public getScenes (): Observable<{}> {
    return this.get(this.user + '/scenes')
  }

  public getUser () {
    return new Promise ((resolve, reject) => {
      this.storage
        .get('username')
        .then(username => {
          if (username) {
            this.user = username
            resolve(username)
          } else {
            this.user = ''
            reject(username)
          }
        })
    })
  }

  public turnOffLight (id: number): Observable<{}>  {
    let body = {
      on: false
    }
    return this.put(this.user + this.lightsUrl + id + '/state', body)
  }

  public turnOffLights (): Observable<{}>  {
    let body = {
      on: false
    }
    // first group contains all the lights
    // note: max 1 req/s
    return this.put(this.user + '/groups/0/action', body)
  }

  public turnOnLight (id: number): Observable<{}>  {
    let body = {
      on: true
    }
    return this.put(this.user + this.lightsUrl + id + '/state', body)
  }

  public turnOnLights (): Observable<{}>  {
    let body = {
      on: true
    }
    // first group contains all the lights
    // note: max 1 req/s
    return this.put(this.user + '/groups/0/action', body)
  }

  /*
    Private helper functions
   */

  private createUser (bridgeIp: string) {
    // TODO: "device" should be something like "iphone peter", although I doubt this is important
    let body = {
      devicetype: 'ambient_workspace#device'
    }

    let request = this.post('', body).map(object => object[0])
    request.subscribe((response: any) => {
      console.log('create user response', response)
      if (response.success) {
        this.storage.set(bridgeIp, response.success.username)
        this.user = response.success.username
      } // TODO: error handling?
    })

    return request
  }

  private delete (url: string = ''): Observable<{}> {
    return this.http
      .delete(this.bridgeUrl + url)
      .map(response => response.json())
      .catch(this.handleError)
  }

  private get (url: string = ''): Observable<{}> {
    return this.http
      .get(this.bridgeUrl + url)
      .map(response => response.json())
      .catch(this.handleError)
  }

  private post (url: string = '', body: {} = {}): Observable<{}> {
    return this.http
      .post(this.bridgeUrl + url, JSON.stringify(body))
      .map(response => response.json())
      .catch(this.handleError)
  }

  private put (url: string = '', body: {} = {}): Observable<{}> {
    return this.http
      .put(this.bridgeUrl + url, JSON.stringify(body))
      .map(response => response.json())
      .catch(this.handleError)
  }

  private handleError (error: Response) : Observable<{}>  {
    console.error(error)
    return Observable.throw(error.json() || 'Server error')
  }
}
