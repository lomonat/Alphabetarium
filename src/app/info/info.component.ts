/*
* Component is managing button to all planets, button with voice info, mute/unmute,
* back to previous exercise. Also posts data to database
*/

import { Component, OnDestroy, OnInit, Input, Injectable, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonMsg } from './jsonMsg.component';
import { HTTPService } from '../service/http.service';
import { User } from '../user';
import { UserData } from '../user.data';
import {SharedService} from '../service/shared.service';




@Component({
  moduleId: module.id,
  selector: 'app-info-component',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
  providers: [HTTPService]
})

  @Injectable()
  export class InfoComponent implements OnChanges, OnInit, OnDestroy {
  public savedMail: string;
  public planetJson: any;
  public title: string;
  @Input() amount: number;
  model: JsonMsg = new JsonMsg('', '', '', '', '', '', '', '', '', '', '', '');
  public planetNumber: number;
  public ufo = 'assets/edward.png';
  public spaceship = 'assets/spaceship.png';
  public back = 'assets/back-button.png';
  public mute = 'assets/mute-button.png';
  public myPathToImage: string;
  public imageExt: string;
  public score = 0;
  public exerciseType: string;
  public savedUser: User;
  public postData: string;
  private myPathToAudio = 'assets/';
  private audioExt = '.wav';
  private audio = new Audio();
  private partNumber: string;
  private timeStamp: any;
  private fullDate: string;
  private userData: UserData;


  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private _httpService: HTTPService, public shared: SharedService) {
  }
  ngOnChanges() {
    // max score
    this.model.max_score = (this.amount * 50).toString();
  }

  ngOnInit() {
    // extract title from text to be shown on the page
    this.shared.dataString$.subscribe(
      data => {
        this.title = data;
      });

    this.planetNumber = this.activatedRoute.snapshot.queryParams['planet'];
    this.partNumber = this.activatedRoute.snapshot.url[0].path;
    this.adjustVolumeIcon();
    this.myPathToImage = 'assets/bkg';
    this.imageExt = '.jpg';
    this.introInfo();
    this.date();
    this.savedMail = localStorage.getItem('__user__email');
    this.savedUser = JSON.parse(localStorage.getItem('userKey'));
    this.userData = new UserData();
    this.audio.volume = this.userData.volume;
    this.adjustVolumeIcon();
  }
  // post all data to tabase
  onPost() {
    this.exerciseTypeFunction();
    this.planetNumberJson();
    this.model.origin_source = this.savedUser.origin_source;
    this.model.user_email = this.savedUser.user_email;
    this.model.client = this.savedUser.client;
    this.model.timestamp = this.fullDate;
    this.model.collection = 'LRS';
    this.model.competence = 'Rechtschreibung';
    this.model.competence_level = this.planetJson;
    this.model.exercise = this.title;
    this.model.exercise_type = this.exerciseType;
    this.model.score = this.score.toString();
    this.model.max_score = (this.amount * 50).toString();
    this.model.mode = this.savedUser.mode;
    this._httpService.postJSON(this.model)
      .subscribe(
        data => this.postData = JSON.stringify(data),
        error => alert(error),
      );
  }
  // translate names from database
  exerciseTypeFunction() {
    if (this.partNumber === 'app-part-1') {
      this.exerciseType = 'Silbenmodel';
    } else if (this.partNumber === 'app-part-2') {
      this.exerciseType = 'Quapptext';
    } else if (this.partNumber === 'app-part-3') {
      if (+this.planetNumber === 4) {
        this.exerciseType = 'Morpheme trennen';
      } else {
        this.exerciseType = 'Silben trennen';
      }
    }
  }
  // translation of number of planets for database
  planetNumberJson() {
    if (+this.planetNumber !== 4) {
      this.planetJson = (+this.planetNumber + 1).toString() ;
    } else if (+this.planetNumber === 4) {
      this.planetJson = (6).toString();
    }
    return this.planetJson;
  }
  // sound on intro
  introInfo() {
    this.audio.src = this.myPathToAudio + this.partNumber + this.planetNumber + this.audioExt;
    this.audio.load();
    this.audio.play();
  }
  // feedback sound
  feedbackInfo() {
    this.audio.src = this.myPathToAudio + 'feedback-' + this.partNumber + this.planetNumber + this.audioExt;
    this.audio.load();
    // auto-start
    this.audio.play();
  }
  // sound before we go to the next exercise
  goAheadInfo() {
    this.audio.src = this.myPathToAudio + 'weiterflug_' + this.planetNumber + this.audioExt;
    this.audio.load();
    // auto-start
    this.audio.play();
  }
 // choose which sound to play. Depends on finished/not finished
  sound(finished: boolean, correct: boolean) {
    this.audio.src = this.myPathToAudio + 'beep' + this.audioExt;
    this.audio.load();
    this.audio.play();
    this.audio.onended = () => {
      this.audio.onended = null;
      if (finished) {
        this.goAheadInfo();
      } else if (!correct) {
        this.feedbackInfo();
      }
   };
  }

  // timestamp
  date() {
    this.timeStamp = Date.now();
    this.fullDate = '';
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1;
    const day = currentTime.getDate();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    this.fullDate += year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' ';
    return this.fullDate;
  }

  ngOnDestroy() {
    // destroy audio here
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
  // routing for planets
  toPlanets() {
    this.router.navigate( ['planets'], { queryParams: { 'planet': this.planetNumber } } );
  }
  // updating score
  updateScore(score) {
    this.score = score['score'];
    const correct = score['correct'];
    const finished = score['redirect'];
    this.sound(finished, correct);
    if (finished) {
      this.onPost();
      this.changePath();
    }
  }
  // choose routing + delay
  changePath(): void {
    console.log('change path');
    if (this.partNumber === 'app-part-1') {
      this.navigate('app-part-2', +this.planetNumber, 5500);
    } else if (this.partNumber === 'app-part-2') {
      this.navigate('app-part-3', +this.planetNumber, 5500);
    } else { // app-part-3
      if (+this.planetNumber === 4) {
        this.navigate('planets', +this.planetNumber + 1, 16000);
      } else {
        this.navigate('planets', +this.planetNumber + 1, 5500);
      }
    }
  }
  // go thruogh page with flying spaceship
  navigate(where: string, planetNumber: number, timeout: number): void {
    setTimeout(() => {
      this.router.navigate( ['app-flight'], { queryParams: { 'planet': planetNumber, 'where': where } });
    }, timeout);
  }

  // backButton navigation
  goBack() {
    if (this.partNumber === 'app-part-2') {
      if (+this.planetNumber !== 4) {
        this.router.navigate(['app-part-1'], {queryParams: {'planet': this.planetNumber}});
      } else {
        this.router.navigate(['app-part-3'], {queryParams: {'planet': 3}});
      }
    } else if (this.partNumber === 'app-part-3') {
      this.router.navigate(['app-part-2'], { queryParams: { 'planet': this.planetNumber} });
    } else { // app-part-1
      if (+this.planetNumber !== 1) {
        this.router.navigate(['app-part-3'], {queryParams: {'planet': +this.planetNumber - 1} });
      } else {
        this.toPlanets();
      }
    }
  }
  // sound mute/ unmute
  muteF() {
    if (this.audio.volume !== 0) {
      this.audio.volume = 0;
    } else {
      this.audio.volume = 1;
    }

    this.userData.volume = this.audio.volume;
    this.userData.save();

    this.adjustVolumeIcon();
  }
  // changing mute button depending on sound
  adjustVolumeIcon(): void {
    if (this.audio.volume === 0) {
      this.mute = 'assets/mute-button2.png';
    } else {
      this.mute = 'assets/mute-button.png';
    }
  }
}
