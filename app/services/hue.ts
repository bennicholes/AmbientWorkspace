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

export let bridgeIp: string = '192.168.1.23'

@Injectable()
export class HueService {
  constructor (private http: Http) {
    this.storage = new Storage(SqlStorage)
  }

  private storage: Storage
  /*
   /lights resource which contains all the light resources
   /groups resource which contains all the groups
   /config resource which contains all the configuration items
   /schedules which contains all the schedules
   /scenes which contains all the scenes
   /sensors which contains all the sensors
   /rules which contains all the rules
  */
  private bridgeUrl: string = 'http://' + bridgeIp + '/api/'
  private lightsUrl: string = '/lights/'

  // dont remember why this is public
  public user: string

  /*
    Public methods
   */

  public changeColor (id: number, state: {}): Observable<{}>  {
    // http://www.developers.meethue.com/documentation/core-concepts
    return this.put(this.user + this.lightsUrl + id + '/state', state)
  }

  public createUser (bridgeIp: string): Observable<{}> {
    // TODO: "device" should be something like "iphone peter", although I doubt this is important
    let body = {
      devicetype: 'ambient_workspace#device'
    }

    let request = this.post('', body).first()

    request.subscribe((response) => {
      if (response.success) {
        this.storage.set(bridgeIp, response.success.username)
        this.user = response.success.username
      } // TODO: error hand ling?
    })

    return request
  }

  /**
   * Might need to clean up all the users I've created...
   * @param username that is to be deleted
   * @returns {Observable<{}>} the request
     */
  public deleteUser (username: string): Observable<{}> {
    return this.delete(this.user + '/config/whitelist/' + username)
  }

  public findBridges () {
    return this.http
      .get('https://www.meethue.com/api/nupnp')
      .map(response => response.json())
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

  public getLights (): Observable<{}> {
    return this.get(this.user + this.lightsUrl)
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
