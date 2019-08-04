import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';


declare var google;

@Component({
  selector: 'app-study-tab',
  templateUrl: 'study-tab.page.html',
  styleUrls: ['study-tab.page.scss']
})
export class StudyPage {
  // map
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  address:string;

  // auth
  studentCookie: string = 'T1RLAQLLc3-31-5oxIhVchYcpZqOPQEbVxDTqkdTzVvhcQU5aVEDq-2-AABw4KzdVHaqqqEyBnUGXWQm6NngAK1alP4NxYfA7SzMFY2wcENco2dG6aUm-PoU5ufW0Jz6EWrnZsMJCt5lQe6C61NfiKSVRsXg1POLAtV23ulAiV7ze0Zn1bxFg9jUgF0DmyfNJJqFhaHZLXmO-4Jsfg**';
  griffithToken: string;
  courseData = [];

  constructor(
    private http: HttpClient,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
    ) {}

  ngOnInit() {
    this.getGriffithToken()
    this.loadMap();
  }

  // Auth Methods
  getGriffithToken() {
    let url = 'https://www108.griffith.edu.au/gatekeeper-api/token';
    let postBody = 'client_id=web_portal&grant_type=urn:gu:oauth:grant-type:sso&assertion=' + this.studentCookie;
    var authHeaders = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Cache-Control', 'no-cache');
    this.http.post(url, postBody, {headers: authHeaders}
    ).subscribe((response) => {
      this.griffithToken = response["access_token"];
      // console.log(this.griffithToken)
      // this needs to be moved out of this function! Just using for hackathon
      this.getGriffithData(this.griffithToken, 'https://www108.griffith.edu.au/gatekeeper-api/mycourses/v1')
    });
  }

  getGriffithData(token, url) {
    var options = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'bearer ' + token);
    this.http.get(url, {headers: options}).subscribe((response: any[]) => {
      this.courseData = response['programs'][0]['teachingPeriods'][0]['courses'];
      // for (var i in courses) {
      //   this.courseData.push({
      //     name: courses[i]['name'],
      //     code: courses[i]['code']
      //   });
      // }
      console.log(this.courseData);
    });
  }

  // Maps methods
  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
      this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map);
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });
 
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
 
  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if(value.length>0)
          responseAddress.push(value);
 
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value+", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) =>{ 
        this.address = "Address Not Available!";
      });
 
  }

}
