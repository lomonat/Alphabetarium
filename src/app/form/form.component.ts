/*
* The component works with registration form.
* If user is in database it will redirect him to next level from previous session.
* The component communicates with backend and search the last planet and last task
* If the user is not in database, it will not allow to continue and throws error
* If mail or name of user is wrong, it throws error too
*/

import { Component } from '@angular/core';
import { User } from '../user';
import { Router } from '@angular/router';
import { HTTPService } from '../service/http.service';
import { CookieService } from 'angular2-cookie/core';
import { UserData } from '../user.data';
import { Location } from '@angular/common';


@Component({
  moduleId: module.id,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [HTTPService]

})

export class FormComponent {
  planetNumber: any;
  modus = ['mit Betreuung', 'ohne Betreuung'];
  model: User = new User('', '', '', 'Alphabetarium');
  getData: any;
  postData: string;
  public failed: string;

  submitted = false;

  constructor(private router: Router, private _httpService: HTTPService,
              private _cookieService: CookieService, private _location: Location) {
  }
// get the data from database
  onGet() {
    this._httpService.getCurrentState(this.model.user_email, this.model.client, 'Alphabetarium')
      .subscribe(
        data => {
          this.getData = data;
          this.toPlanets();
        },

        error => alert(error),
      );
  }
// post information from form to databank. Then get the answer from databank
  onPost() {
    const messageForDb = (JSON.stringify(this.model));
    localStorage.setItem('userKey', messageForDb);
    this._httpService.postJSON(this.model)
      .subscribe(
        data => {
          this.postData = JSON.stringify(data);
          this.onGet();
        },
        error => alert(error),
      );
  }

  onSubmit() {
    this.submitted = true;
  }

  get diagnostic() {
    return JSON.stringify(this.model);
  }
// Method to sort out the biggest planet and task
  toPlanets() {
    let planet = 0;
    let planetNav: number;
    let partNav: string;
    let part: string;
    let maxPlanetarr = [];
    let maxPlanetarrSum = [];
    let json = this.getData;
    //if the user is in database
    if (json.status !== 'failed' && this.model.mode !== '') {
      //if the user made some tasks
      if (json.message.lessons.length !== 0) {
        //in this app the planets starts with 1: 1,2,3,4. In the database (Backend) the palnets there is different enumeration
        // 1 = 2, 2 = 3, 3 = 4, 4 = 6. It is necesary to translate the enumeration
        for (let i = 0; i < json.message.lessons.length; i++) {
          if (planet < parseInt(json.message.lessons[i].competence_level, 10)) {
            planet = parseInt(json.message.lessons[i].competence_level, 10);
          }
          if (planet !== 6) {
            planetNav = planet - 1;
          } else {
            planetNav = 4;
          }
        }

        for (let i = 0; i < json.message.lessons.length; i++) {
          if (parseInt(json.message.lessons[i].competence_level, 10) === planet) {
            maxPlanetarr.push(json.message.lessons[i]);
          }
        }

        // Database and App has dofferent names for tasks. Need to be translated
        for (let i = 0; i < maxPlanetarr.length; i++) {
          if (maxPlanetarr[i].exercise_type === 'Silben trennen' || maxPlanetarr[i].exercise_type === 'Morpheme trennen') {
            partNav = 'app-part-3';
            maxPlanetarrSum.push(partNav);
          } else if (maxPlanetarr[i].exercise_type === 'Quapptext') {
            partNav = 'app-part-2';
            maxPlanetarrSum.push(partNav);
          } else if (maxPlanetarr[i].exercise_type === 'Silbenmodel') {
            partNav = 'app-part-1';
            maxPlanetarrSum.push(partNav);
          }
        }
        // Choose the last task
        for (let i = 0; i < maxPlanetarrSum.length; i++) {
          if (maxPlanetarrSum.indexOf('app-part-3') > -1) {
            part = 'app-part-3';
            break;
          } else if (maxPlanetarrSum.indexOf('app-part-2') > -1) {
            part = 'app-part-2';
            break;
          } else {
            part = 'app-part-1';
          }
        }

        this.navigate(planetNav, part);
      } else {
       // if there was no tasks before - go to this.planetNumber = 1;
        this.router.navigate( ['planets'], { queryParams: { 'planet': this.planetNumber } } );
      }
    // warning messages
    } else if (this.model.mode === '') {
      this.failed = 'Please choose the modus';
    } else {
      this.failed = json.message;
    }
  }
  // method to navigate
  navigate(planet, part) {
    if (part === 'app-part-1') {
      this.router.navigate(['app-part-2'], {queryParams: {'planet': planet}});
    } else if (part === 'app-part-2') {
      this.router.navigate(['app-part-3'], {queryParams: {'planet': planet}});
    } else {
      if (planet === 4) {
        this.router.navigate(['results']);
      } else if (planet === 3){
       this.router.navigate(['app-part-2'], {queryParams: {'planet': 4}});
      } else {
        this.router.navigate(['app-part-1'], {queryParams: {'planet': planet + 1}});
      }
    }
  }
}

