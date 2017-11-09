/*
* The component is responsible for trnasitional page with spaceship (between tasks)
*/

import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { UserData } from '../user.data';

@Component({
  moduleId: module.id,
  selector: 'app-flight',
  template: `
  <div><img id="background" [src]='gif'/>
  <img id="spaceship" [src]="spaceship" />
  </div>
  `,
  styleUrls: ['./flight.component.css']

})

export class FlightComponent  implements OnInit {
  public gif;
  public spaceship;
  public audio = new Audio();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.gif = 'assets/giphy.gif';
    this.spaceship = 'assets/spaceship.png';
    this.audio.src = 'assets/sound_spaceship.wav'; //  4000 ms
    this.audio.load();
    this.audio.play();

    const where = this.activatedRoute.snapshot.queryParams['where'];
    const planetNumber = this.activatedRoute.snapshot.queryParams['planet'];

    const userData = new UserData();
    this.audio.volume = userData.volume;
    if (userData.planet < planetNumber) {
      userData.planet = planetNumber;
      userData.save();
    }
  // auto-redirect in 4000 ms
    setTimeout(() => {
      this.router.navigate( [where], { queryParams: { 'planet': planetNumber}});
    }, 4000);
  }
}
