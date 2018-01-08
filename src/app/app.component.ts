import { Component, Injectable, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { log } from 'util';

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
  lineChartData: any;
  constructor(private http: Http) { }
  ngOnInit() {
    let permission = confirm("Know your location");
    if (permission && navigator.geolocation) {
      let lat: any;
      let long: any;
      navigator.geolocation.getCurrentPosition(function (position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;
      });
      setTimeout(() => {
        this.getLocationDetails(lat, long);
      }, 500);
      let cityName = 'pune';
      let reqUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + cityName + '%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
      this.getWeatherDetails(reqUrl);
      this.clearInterval = setInterval(() => {
        this.getWeatherDetails(reqUrl);
      }, 60000);
      // this.ngOnDestroy();
    } else {
    }
  }

  public getWeatherDetails(url): any {
    this.detailsInfo = [];
    return this.http.get(url).subscribe(res => {
      let response = (JSON.parse(res['_body']));
      console.log(response)
      this.detailsInfo.push(response.query.results.channel);      
      let lineChartDataSet = [];
      lineChartDataSet.push(['Week Days', 'High', 'Low']);
      for(let i = 0; i < response.query.results.channel.item.forecast.length; i++){
        lineChartDataSet.push([
          response.query.results.channel.item.forecast[i].day,
          parseInt(response.query.results.channel.item.forecast[i].high),
          parseInt(response.query.results.channel.item.forecast[i].low)
        ]);
      }
      this.lineChartData =  {
        chartType: 'LineChart',
        dataTable: lineChartDataSet,
        options: {
          'title': 'Weather Forecast',
          'legend': { 'position': 'bottom' },
          'colors': ['#F6C685', '#A07993'],
          'backgroundColor': '#9CA3C5',
          'is3D': true,
          'width': '1200',
          'height': '500',
          'chartArea': {'left': '80', 'right': '80', 'top': '80', 'bottom': '80' },
          'isStacked': true,
          'explorer': {
            'keepInBounds': true,
            'maxZoomIn': 4.0
          },
        },
      };
    }, err => {
      console.log(err);
    })
  }

  public getLocationDetails(lat, long): void {
    let apiKey = 'AIzaSyA3m47g4hkHhbb7beuukIDvd-8mvxEIdCE';
    let reqUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key='+ apiKey +'&sensor=true';
    this.http.get(reqUrl).subscribe(res => {
      let response = (JSON.parse(res['_body']));
      console.log(response)
    }, err => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    if (this.clearInterval) {
      clearInterval(this.clearInterval);
      console.log("Interval Cleared");

    }
  }
}
