import { Component, Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent implements OnInit {
  clearInterval: any;
  location: Coordinates;
  detailsInfo: any;
  title = 'app';
  constructor(private http: Http) { }
  ngOnInit() {
    let permission = confirm("Know your location");
    if (permission && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getPostion);
      let cityName = 'pune';
      let reqUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+ cityName +'%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
      this.getWeatherDetails(reqUrl);      
      this.clearInterval = setInterval(() => {
        this.getWeatherDetails(reqUrl);
      }, 60000);
      // this.ngOnDestroy();
      // http://maps.googleapis.com/maps/api/geocode/json?latlng=18.5171414,73.7771917&sensor=true
    } else {
    }
  }

  public getPostion(position): void{
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
  }

  public getWeatherDetails(url): any {
    this.detailsInfo = [];
    return this.http.get(url).subscribe(res => {
      let response = (JSON.parse(res['_body']));
      console.log(response)
      this.detailsInfo.push(response.query.results.channel);
      console.log(this.detailsInfo);      
    }, err => {
      console.log(err);
    })
  }

  ngOnDestroy() {
    if (this.clearInterval) {
      clearInterval(this.clearInterval);
      console.log("Interval Cleared");
      
    }
  }
}
