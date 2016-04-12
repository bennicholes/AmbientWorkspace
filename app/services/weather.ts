import { Injectable } from 'angular2/core'
import { Http, Response } from 'angular2/http'
import 'rxjs/operator/map'

@Injectable()
export class WeatherService {
  private http: Http
  private weather: {}

  constructor (http: Http) {
    this.http = http
  }

  public getWeather() {
    let weatherApiKey = 05f01edbb3e1a04a7e2afac3daf4d0d3;
    let zipcode = 89503;

    this.http
      .get('http://api.openweaethermap.org/data/2.5/weather?zip=' + zipcode + ',us&appid=' + weatherApiKey)
      .map(response => response.json())
      .subscribe(json => this.weather = json)
      .catch(error => console.error(error))

      console.log(weather);
  }
}
