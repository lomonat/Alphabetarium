/*
* first landing page
*/

import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: ` 
    <body>
      <button (click)='toRegistration()'>Weiter</button>
      <p id='name' class='gradient-text'>{{title}}</p>
      <img id='book' [src]='book'/>
      <img id='ufo' [src]='ufo'/>
      <img id='background' [src]="backgroundImg"/>
    </body>
  `,
 styleUrls: ['./title.component.css']

})

export class TitleComponent implements OnInit, OnDestroy {
  public book = 'assets/book.png';
  public ufo = 'assets/ufo.png';
  public title = 'Alphabetarium';
  public backgroundImg = 'assets/background_title.jpg';
  private audio: any;

  constructor(private router: Router) {}
  // Audion description of app
  ngOnInit () {
    this.audio = new Audio();
    this.audio.src = 'assets/hallo.wav';
    this.audio.load();
    // auto-start
    this.audio.play();
  }

  ngOnDestroy() {
    // destroy audio here
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
  // navigates to registration form
  toRegistration() {
    this.router.navigate( ['registration'] );
  }

}
