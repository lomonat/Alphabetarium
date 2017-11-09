/*
"Exercise 1 "Silbehäuschen modell
*/

import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../serviceXml/data.service';
import { InfoComponent } from '../info/info.component';
import { SharedService } from '../service/shared.service';


@Component({
  moduleId: module.id,
  selector: 'app-part-1',
  templateUrl: 'part1.component.html',
  styleUrls: ['./part1.component.css'],
  providers: [DataService, InfoComponent]
})

export class Part1Component implements OnInit {
  public title: any;
  @ViewChild(InfoComponent) private infocomp: InfoComponent;
  @Output() valueChanged = new EventEmitter();

  public values = '';
  public itemsSource: string[][];
  public input: any = [];
  public planetNumber: number;
  public examples = [['Ro sen'], ['Kette '], ['Ho se ', 'Wolke ', 'Wolle '], ['sa gen']];
  public amount;
  private sourceWords: string[] = [];
  private helper: { 'value': string }[][] = [];
  private wasCorrect: boolean[] = []; // index of this.wasCorrect array says if element this.helper[index]
  private score = 0;
  private triesLeft = 2;

  constructor(public dataService: DataService, private activatedRoute: ActivatedRoute, public shared: SharedService) {}

  ngOnInit() {
    this.planetNumber = this.activatedRoute.snapshot.queryParams['planet'];
    // Get data from data service
    this.dataService.get().subscribe(data => {
      this.itemsSource = this.dataService.convert(data, 1);
      this.title = this.itemsSource[0];
      this.amount = this.itemsSource[1].length;
      for (let i = 0; i < this.itemsSource[1].length; i++) {
        this.sourceWords.push(this.itemsSource[1][i][0]);

        // logic for dynamically populating this.helper
        const arr: { 'value': string }[] = [];
        for (let j = 0; j < 6; j++) {
          arr.push({value: ''});
        }
        this.helper.push(arr);

        // logic to dynamically populate this.wasCorrect array
        this.wasCorrect.push(false); // saying that none of the elements in the helper were correct
      }
      // get titel and set it to shared component
      this.title = this.itemsSource[0];
      this.setSharedValue(this.title);
    });
    return this.helper;
  }

  setSharedValue(titleOfText) {
    this.shared.insertData(titleOfText);
  }

  isVowel(s: any): boolean {
    let result;
    if (!s) {
      return false;
    }

    if (s.length === 1) {
      return this.isVovelChar(s);
    }

    for (let i = 0; i < s.length; i++) {
      if (!this.isVovelChar(s[i])) {
        return false;
      }
    }

    return true;
  }
  // check if letter is vowel
  isVovelChar(s: string): boolean {
    s = s.toLowerCase();
    return s === 'a' || s === 'ä' || s === 'e' || s === 'i' || s === 'o' || s === 'u' || s === 'y' || s === 'ö' || s === 'ü';
  }

  correct(index: number) { // adds the score, if word was guessed correctly
    if (!this.wasCorrect[index]) { // if it was not correct, but it became correct now
      if (this.triesLeft === 2) {
        this.score += 50;
      } else {
        this.score += 25;
      }
      this.wasCorrect[index] = true;
    }
  }

  hasVowel(s: string): boolean {
    for (let i = 0; i < s.length; i++) {
      if (this.isVovelChar(s[i])) {
        return true;
      }
    }

    return false;
  }

  returnScore() {
    if (this.triesLeft <= 0) { // do not do anything, if there are no tries left
      return;
    }

    for (let i = 0; i < this.helper.length; i++) { // for every word
      const syllables: string[] = this.itemsSource[1][i][1].split('-');
      let correct = true;
      let j = 0;
      while (j < syllables.length && correct) { // while there are syllables in the word - check each syllable
        const syllable: string = syllables[j];
        const offset: number = j * 3;
        const firstItem = this.helper[i][offset].value;
        const secondItem = this.helper[i][1 + offset].value;
        const thirdItem = this.helper[i][2 + offset].value;

        // if there is no vowel in second input or there are vowels in third or first, it is incorrect
        if (!secondItem || this.isVowel(thirdItem) || this.isVowel(firstItem) || this.hasVowel(firstItem) || this.hasVowel(thirdItem)) {
          correct = false;
        } if (syllable.length === 3) { // if there are 3 letters in a syllable - make sure inputs are the same as oracle and vo
          const comparableSyllable: string = firstItem + secondItem + thirdItem;
          if (syllable !== comparableSyllable || (!this.isVowel(secondItem))) {
            correct = false;
          }
        } else if (syllable.length === 2) { // if syllable length is 2
          const comparableSyllable: string = firstItem + secondItem + thirdItem;
          if (syllable !== comparableSyllable) { // if user syllable is not the same as oracle, then it is incorrect
            correct = false;
          } else {
            const firstChar: string = syllable.charAt(0);
            const secondChar: string = syllable.charAt(1);
            if (this.isVowel(firstChar)) { // if first character of the oracle is a vowel,
              if (this.isVowel(secondChar)) { // if both characters are vowel
                if (secondItem !== firstChar + secondChar) { // then both those characters must be in the second input
                  correct = false;
                }
              } else { // if only 1st char is vowel, but second char is not
                if (secondItem !== firstChar) { // then only first char must be in second input
                  correct = false;
                }
              }
            } else { // if first char is not a vowel, then it must be in the first input,
              // because second char is a vowel and must be in the second input
              if (firstItem !== firstChar) {
                correct = false;
              }
            }
          }
        } else if (syllable.length === 1) { // if there is 1 letter in the syllable, then it should be a vowel in a second input
          if (syllable !== secondItem) {
            correct = false;
          }
        } else { // syllable has more than 3 chars in it, meaning in some inputs there is more than 1 letter
          const vowel = this.findVowel(syllable); // find a vowel in the oracle
          const chars: string[] = syllable.split(vowel);
          // letters before vowel must be in the first input, vowel in the second, and letters after vowel in third
          if (chars[0] !== firstItem || vowel !== secondItem || chars[1] !== thirdItem) {
            correct = false;
          }
        }
        j++;
      }

      if (correct) { // if correct, mark as correct
        this.correct(i);
      } else { // if incorrect - remove wrong entries from the inputs
        for (let k = 0; k < this.helper[i].length; k++) {
          this.helper[i][k].value = '';
        }
      }
    }
    // tell infocomponent ro update score
    if (this.score >= this.helper.length * 50) {
      this.infocomp.updateScore({'score': this.score, 'correct': true, 'redirect': true});
      return;
    }

    this.triesLeft--;
    // redirect if the are no more tries left
    if (this.triesLeft === 0) {
      this.infocomp.updateScore({'score': this.score, 'redirect': true});
    } else {
      this.infocomp.updateScore({'score': this.score});
    }
  }
  // find Vowels in word
  findVowel(s: string): string {
    for (let i = 0; i < s.length; i++) {
      const char = s.charAt(i);
      if (this.isVowel(char)) {
        const nextChar = s.charAt(i + 1);
        if (this.isVowel(nextChar)) {
          return char + nextChar;
        }
        return char;
      }
    }
    return null;
  }
}
