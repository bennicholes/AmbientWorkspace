import { Injectable } from 'angular2/core'
import { Http, Response } from 'angular2/http'
import { Observable } from 'rxjs/Rx'
import 'rxjs/operator/map'

@Injectable()
export class WeatherService {
  constructor (private http: Http) {
  }

  private weatherApiKey: string = '05f01edbb3e1a04a7e2afac3daf4d0d3'

  public getWeather(zipCode: number = 89503): Observable<{}> {
    return this.http
      .get(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${this.weatherApiKey}`)
      .map(response => response.json())
      .catch(this.handleError)
  }

  private handleError (error: Response) : Observable<{}>  {
    console.error(error)
    return Observable.throw(error.json() || 'Server error')
  }
}
