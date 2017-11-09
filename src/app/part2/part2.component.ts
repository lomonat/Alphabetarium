/*
* Component is responsible for 2nd exercise "Quapptext
*/

import {Component, OnInit, ViewChild} from '@angular/core';
import { DataService } from '../serviceXml/data.service';
import { ActivatedRoute } from '@angular/router';
import { FillInBlankComponent } from './fillinblank/fillinblank.component';
import { InfoComponent } from '../info/info.component';

@Component({
  moduleId: module.id,
  selector: 'app-part-2',
  templateUrl: 'part2.component.html',
  styleUrls: ['../fillinblankparent.component.css'],
  providers: [DataService, InfoComponent]
})

export class Part2Component implements OnInit {
  @ViewChild(FillInBlankComponent) private fill: FillInBlankComponent;
  @ViewChild(InfoComponent) private info: InfoComponent;

  public itemsSource: string;
  public wordsToCheck: string[];
  public available = false;
  public planetNumber: number;
  public title: string;
  public wordsForInput: string;
  public amount;

  constructor(public dataService: DataService,
              private activatedRoute: ActivatedRoute) {
    // get data from data service
    this.dataService.get().subscribe(data => {
      const d = this.dataService.convert(data, 2);

      this.title = d[0];
      this.itemsSource = d[1][0];
      this.wordsToCheck = d[1][1];
      this.wordsForInput = d[1][2];
      this.available = true;
      this.amount = this.wordsToCheck.length;

    });
  }

  ngOnInit() {
    this.planetNumber = this.activatedRoute.snapshot.queryParams['planet'];
  }
  // check the answers. Logic from fillinblank that extends fillinblankparent
  calculateScore() {
    this.fill.check();
  }
  // update the score in info component
  returnScore(score) {
    this.info.updateScore(score);
  }
}
