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
  constructor (http: Http) {
    this.http = http
    this.storage = new Storage(SqlStorage)
  }

  private http: Http
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
  private bridgeUrl: string = 'http://'+ bridgeIp + '/api/'
  private lightsUrl: string = '/lights/'

  public user: string

  public changeColor (id: number, state: {}): Observable<{}>  {
    // http://www.developers.meethue.com/documentation/core-concepts
    return this.put(this.user + this.lightsUrl + id + '/state', state)
  }

  public createUser (): Observable<{}> {
    // TODO: look at what 'devicetype' is
    let body = {
      devicetype: 'my_hue_app#android denis'
    }

    let request = this.post('', body)

    request.subscribe((responses) => {
      let response = responses[0]
      if (response.success) {
        this.storage.set('username', response.success.username)
        this.user = response.success.username
      }
    })

    return request
  }

  public findBridges () {
    // TODO: Not super important. Right now the bridge IP is harded coded in, you can find it by using official hue app
  }

  public getLights (): Observable<{}>  {
    return this.get(this.user + this.lightsUrl)
  }

  public getLight (id: number): Observable<{}>  {
    return this.get(this.user + this.lightsUrl + id)
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
