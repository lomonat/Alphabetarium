/*
 * Component is responsible for 3d exercise "Silben trennen/Morpheme trennen
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataService } from '../serviceXml/data.service';
import { InfoComponent } from '../info/info.component';
import { FillInBlank2Component } from './fillinblank2/fillinblank2.component';

@Component({
  moduleId: module.id,
  selector: 'app-part-3',
  templateUrl: 'part3.component.html',
  styleUrls: ['../fillinblankparent.component.css'],
  providers: [DataService]
})

export class Part3Component implements OnInit {
  @ViewChild(FillInBlank2Component) private fill: FillInBlank2Component;
  @ViewChild(InfoComponent) private info: InfoComponent;

  public itemsSource: string;
  public words: string[];
  public splitWords: string[];
  public available = false;
  public planetNumber: number;
  public title: string;
  public amount;

  constructor(public dataService: DataService,  private activatedRoute: ActivatedRoute) {
    this.dataService.get().subscribe(data => {
      const d = this.dataService.convert(data, 3);

      this.title = d[0];
      this.itemsSource = d[1][0];
      this.words = d[1][1];
      this.splitWords = d[1][2];
      this.amount = this.words.length;
      this.available = true;
    });
  }

  ngOnInit() {
    this.planetNumber = this.activatedRoute.snapshot.queryParams['planet'];
  }

  // check the answers. Logic from fillinblank2 that extends fillinblankparent
  calculateScore() {
    this.fill.check();
  }

  // update the score in info component
  returnScore(score) {
    this.info.updateScore(score);
  }
}
