/*
* Show result table of achieved points by user
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HTTPService } from '../service/http.service';
import { CookieService } from 'angular2-cookie/core';

@Component({
  templateUrl: 'results.component.html',
  styleUrls: ['./results.component.css'],
  providers: [HTTPService]
})

export class ResultsComponent implements OnInit {
  public bck: string;
  public parts: string[];
  public result_table = [];
  public spaceship = 'assets/spaceship.png';
  public edward = 'assets/edward.png';
  private requestData: any;
  private getData: any;

  constructor(private router: Router, private _cookieService: CookieService, private _httpService: HTTPService) {}

  ngOnInit() {
    this.bck = 'assets/results.jpg';
    this.buildArr(this.result_table);
    this.requestData = JSON.parse(localStorage.getItem(('userKey')));
    this.onGet();
    this.buildArr(this.result_table);
    this.parts = ['Spiel1'];
  }

  //Method for populating data in table
  buildArr(theArr: any[]) {
    const arrOfarr = [];
    for (let i = 0; i < theArr.length ; i += 4) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        const value = theArr[i + j];
        if (value) {
          row.push(value);
        }
      }
      arrOfarr.push(row);
    }
    return arrOfarr;
  }

  // Get data from database
  onGet() {
    this._httpService.getCurrentState(this.requestData.user_email, this.requestData.client, this.requestData.origin_source)
      .subscribe(
       data => { this.getData = data; this.showResult(); },
        error => alert(error),
      );
  }

  // Build array of results
  showResult() {
    let lessons = this.getData.message.lessons;
    const options = ['Silbenmodel', 'Quapptext', 'Silben trennen'];
    for (let j = 2; j < 5; j++) {
      for (let i = 0; i < options.length; i++) {
        this.sortMethod(lessons, j, options[i]);
      }
    }

    this.result_table.splice(3, 0, "-");
    this.sortMethod(lessons, 6 , 'Quapptext' );
    this.sortMethod(lessons, 6 , 'Morpheme trennen' );
  }
  // Method, that helps to choose rigth exercises and planets (not mishing
  sortMethod(arr: any, planet: number, exercise: string) {
    let arr_sorted = [];
    for (let i = 0; i < arr.length; i++ ) {
      if ((parseInt(arr[i].competence_level, 10) === planet) && (arr[i].exercise_type === exercise)) {
            arr_sorted.push(arr[i]);
      }
    }
    this.getBiggest(arr_sorted);
  }

  // Get max. achieved point
  getBiggest(arr) {
    let min = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== undefined) {
        if ((parseInt(arr[i].score, 10)) > min) {
          min = parseInt(arr[i].score, 10);
        }
      }
    }
    // Get %, push it to the table array
    let points  = Math.round((min * 100) / (arr[0].max_score));
    this.result_table.push(points);
  }

  // Method for button, that allows the user to get back to the map with planets
  toPlanets() {
    this.router.navigate(['planets']);
  }
}
