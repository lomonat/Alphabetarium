/*
* Map with planets and flying spaceship between the planets
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HTTPService } from '../service/http.service';


@Component({
  templateUrl: 'planets.component.html',
  styleUrls: ['./planets.component.css'],
  providers: [HTTPService]

})

export class PlanetsComponent implements OnInit {
  public open: number;
  public planet = 0;
  public requestData: any;
  public earth = 'assets/earth.png';
  public spaceship = 'assets/spaceship.png';
  public planet2 = 'assets/planet2.png';
  public planet3 = 'assets/planet3.png';
  public planet4 = 'assets/planet4.png';
  public planet5 = 'assets/planet5.png';
  public planet10 = 'assets/planet10.png';
  public planetNumber: number;
  public backgroundImg = 'assets/universe_background.jpg';

  constructor(private router: Router, private httpService: HTTPService) {}
 // when the page is opening, we need to get data from database to decide, which planet must be opened and which closed for user
 ngOnInit() {
   this.requestData = JSON.parse(localStorage.getItem(('userKey')));
   this.onGet();
  }
  // By clicking on the open planet -> go to the exercise 1.
  // If user is on the last planet -> go to the exercise 2.
  choosePlanet(planetNumber: number) {
    if (planetNumber <= this.planetNumber) {
       if (planetNumber === 4) {
         this.router.navigate( ['app-part-2'], { queryParams: { 'planet': planetNumber } });
       } else {
        this.router.navigate( ['app-part-1'], { queryParams: { 'planet': planetNumber } });
      }
    }
  }
  // 5th planet is planet with results
  chooseResults() {
    this.router.navigate( ['results'] );
  }
  // get data from database and as soon as data is coming, sort data with findMaxPlanet() method
  onGet() {
    this.httpService.getCurrentState(this.requestData.user_email, this.requestData.client, this.requestData.origin_source)
      .subscribe(
        data => {
          if (data.message.lessons.length === 0) {
            this.planetNumber = 1;
          } else {
            this.findMaxPlanet(data);
          }
        },
        error => alert(error),
      );
  }
  // Find max. achieved planet.
  // Sort data from database. If 1st and 2nd exercise was done, stay on current max planet.
  // If 3d exercise was done -> go to the next planet
  findMaxPlanet(json: any) {
    const lessons = json.message.lessons;
    let planet = 0;
    let planetNav: number;
    let partNav: string;
    let part: string;
    const maxPlanetarr = [];
    const maxPlanetarrSum = [];
    if (lessons.length === 0) {
      this.planetNumber === 1;
    } else {
        for (let i = 0; i < lessons.length; i++) {
          if (planet < parseInt(lessons[i].competence_level, 10)) {
            planet = parseInt(lessons[i].competence_level, 10);
          }
         if (planet !== 6) {
            planetNav = planet - 1;
          } else {
            planetNav = 4;
          }
        }
    }

    for (let i = 0; i < json.message.lessons.length; i++) {
      if (parseInt(json.message.lessons[i].competence_level, 10) === planet) {
        maxPlanetarr.push(json.message.lessons[i]);
      }
    }

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

    if (part === 'app-part-3') {
      // next planet
      this.open = planetNav + 1;
    } else if ((part === 'app-part-2' || part === 'app=part-1')) {
      // stay on this planet
      this.open = planetNav;
    } else {
      this.open = 1;
    }
    this.planetNumber = this.open;
  }
}
