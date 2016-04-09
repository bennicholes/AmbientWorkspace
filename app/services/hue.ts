import { Injectable } from 'angular2/core';
import { Http, Headers, Response, RequestOptions } from 'angular2/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HueService {
  private http: Http;
  constructor (http: Http) {
    this.http = http;
  }

  public user: string;

  private bridgeUrl = 'http://192.168.1.23/api/';
  // No idea why it's like this
  private lightsUrl = '1028d66426293e821ecfd9ef1a0731df/lights/';

  /*
   /lights resource which contains all the light resources
   /groups resource which contains all the groups
   /config resource which contains all the configuration items
   /schedules which contains all the schedules
   /scenes which contains all the scenes
   /sensors which contains all the sensors
   /rules which contains all the rules
   */

  public getBridges () {
    return this.http.get(this.bridgeUrl)
      .map(res => res.json())
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  public createUser () {
    let body = JSON.stringify({
      devicetype: 'my_hue_app#iphone peter'
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.bridgeUrl, body, options)
      .map(res => res.json())
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  public getLights () {
    return this.http.get(this.bridgeUrl + this.lightsUrl)
      .map(res => res.json())
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  public getLight (id: number) {
    return this.http.get(this.bridgeUrl + this.lightsUrl + id)
      .map(res => res.json())
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  public turnOffLight (id: number) {
    let body = JSON.stringify({
      on: false
    });
    return this.http.put(this.bridgeUrl + this.lightsUrl + id + '/state', body)
      .map(res => res.json())
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  public turnOnLight (id: number) {
    let body = JSON.stringify({
      on: true
    });
    return this.http.put(this.bridgeUrl + this.lightsUrl + id + '/state', body)
      .map(res => res.json())
      .do(data => console.log(data))
      .catch(this.handleError);
  }

  public changeColor (id: number) {
    let body = JSON.stringify({
      on: true, // idk if necessary
      sat: 254,
      bri: 254,
      hue: 10000
    });
    return this.http.put(this.bridgeUrl + this.lightsUrl + id + '/state', body)
      .map(res => res.json())
      .do(data => console.log(data))
      .catch(this.handleError);
  }
  /*
  addHero (name: string) : Observable<Hero>  {

    let body = JSON.stringify({ name });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.bridgeUrl, body, options)
      .map(res =>  <Hero> res.json().data)
      .catch(this.handleError)
  }
  */

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}
