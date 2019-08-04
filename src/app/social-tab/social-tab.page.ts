import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-social-tab',
  templateUrl: 'social-tab.page.html',
  styleUrls: ['social-tab.page.scss']
})
export class SocialPage {
  // auth
  studentCookie: string = 'T1RLAQLLc3-31-5oxIhVchYcpZqOPQEbVxDTqkdTzVvhcQU5aVEDq-2-AABw4KzdVHaqqqEyBnUGXWQm6NngAK1alP4NxYfA7SzMFY2wcENco2dG6aUm-PoU5ufW0Jz6EWrnZsMJCt5lQe6C61NfiKSVRsXg1POLAtV23ulAiV7ze0Zn1bxFg9jUgF0DmyfNJJqFhaHZLXmO-4Jsfg**';
  griffithToken: string;
  courseData = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getGriffithToken()
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

}
