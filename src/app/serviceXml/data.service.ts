/*
* Service, which get data from XML and filters it
* */

import { Injectable } from '@angular/core';
import * as X2JS from 'x2js';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/Rx';

@Injectable()
  export class DataService {
  public list2 = [];
  public jsonObj: any;
  public data: any;
  public headers = new Headers({'Content-Type': 'application/json'});
  public planetNumber;
  public url_x;
  public myPathToXml;
  public ext;
  public words = [];
  public text: string;
  public partNumber;

  constructor(private http: Http, private activatedRoute: ActivatedRoute) {}

  choose_x() {
    this.planetNumber = this.activatedRoute.snapshot.queryParams['planet'];
    this.partNumber = this.activatedRoute.snapshot.url[0].path;
    this.myPathToXml = 'assets/';
    this.ext = '.xml';
    this.url_x = this.myPathToXml + this.planetNumber + this.ext;
    return this.url_x;
  }

  get(): Observable<any> {
    this.choose_x();
    return this.http.get(this.url_x, this.headers).map((res) => res.text());
  }

  // LV with graphems ie, V, diphthong
  myf_LV(array1: any, array2: any) {
    array1 = array2.filter((a) => {
      return ((a['_akzsilb'] === 'LV'
      && (a['_graphem'] === 'ie' || a['_graphem'] === 'V' || a['_graphem'] === 'diphthong'))
      && (a['_POS'] !== 'VVFIN' && a['_POS'] !== 'CARD' && a['_graphem'] !== 'dehn-h' ));
    });
    return array1;
  }

  // KV with graphems KC, Vr
  myf_KV(array1: any, array2: any) {
    array1 = array2.filter((a) => {
      return ((a['_akzsilb'] === 'KV'
      && (a['_graphem'] === 'KC' || a['_graphem'] === 'Vr' ))
      && (a['_POS'] !== 'VVFIN' && a['_POS'] !== 'CARD' && a['_graphem'] !== 'dehn-h' ));
    });
    return array1;
  }

  // KV with graphems CC, tz, ck
  myf_KV2(array1: any, array2: any) {
    array1 = array2.filter((a) => {
      return ((a['_akzsilb'] === 'KV'
      && (a['_graphem'] === 'CC' || a['_graphem'] === 'tz' || a['_graphem'] === 'ck'))
      && (a['_POS'] !== 'VVFIN' && a['_POS'] !== 'CARD' && a['_graphem'] !== 'dehn-h' ));
    });
    return array1;
  }
  // Special case for forth planet (Verbs)
  fourthP(array1: any, array2: any) {
    array1 = array2.filter((a) => {
      return ((a['_POS'] === 'VVFIN') && ((a['_akzsilb'] === 'KV'
      && (a['_graphem'] === 'KC' || a['_graphem'] === 'VR' ))
      || (a['_akzsilb'] === 'LV'
      && (a['_graphem'] === 'ie' || a['_graphem'] === 'V' || a['_graphem'] === 'diphthong' || a['_graphem'] === 'ini-h'))
      || (a['_akzsilb'] === 'KV'
      && (a['_graphem'] === 'CC' || a['_graphem'] === 'tz' || a['_graphem'] === 'ck'))));
    });
    return array1;
  }

  convert(data: any, part: number): any {
    // apply xml2js and xml2dom converter
    const xmlString = data;
    const x2js = new X2JS();
    this.jsonObj = <any>x2js.xml2js(xmlString.toString());
    const dom = <any>x2js.xml2dom(xmlString.toString());
    this.text = '';
    const satz = dom.getElementsByTagName('satz');
    for (let i = 0; i < satz.length; i++) {
      // Remove spaces before pointt, commas, line breaks
      this.text += satz[i].textContent.replace(/(\r\n|\n|\r)/gm, ' ').replace(/ +/g, ' ').replace(' .', '.').replace(' ,', ',');
    }
    const result = [];
    const result5 = [];
    // Find all NC, VC, PC
    for (let i = 0; i < this.jsonObj.text.satz.length; i++) {
      if (this.jsonObj.text.satz[i].hasOwnProperty('NC')) {
        result.push((this.jsonObj.text.satz[i].NC));
      }
    }
    for (let i = 0; i < this.jsonObj.text.satz.length; i++) {
      if (this.jsonObj.text.satz[i].hasOwnProperty('VC')) {
        result.push((this.jsonObj.text.satz[i].VC));
      }
    }
    for (let i = 0; i < this.jsonObj.text.satz.length; i++) {
      if (this.jsonObj.text.satz[i].hasOwnProperty('PC')) {
        result.push((this.jsonObj.text.satz[i].PC));
      }
    }

    const result1 = result.filter((x, i, a) => a.indexOf(x) === i);
    const result2 = [];
    for (let i = 0; i < result.length; i++) {
      if (result1[i] !== undefined) {
        result2.push(result1[i]);
      }
    }
    const result2_red = result2.reduce((initial, elem) => initial.concat(elem), []);
    const list = result2_red.filter((x, i, a) => a.indexOf(x) === i);

    // Find all langw
    const tempLangw = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].hasOwnProperty('langw') && list[i].langw !== undefined ) {
        tempLangw.push(list[i].langw);
      }
    }

    // Find all merkw
    const tempMerkw = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].hasOwnProperty('merkw') && list[i].merkw !== undefined ) {
        tempMerkw.push(list[i].merkw);
      }
    }
    // Find all langw klusterw
    const tempLangwKlusterw = [];
    for (let i = 0; i < tempLangw.length; i++) {
      if (tempLangw[i].hasOwnProperty('klusterw')) {
        tempLangwKlusterw.push(tempLangw[i].klusterw);
      }
    }

    // Find all klusterw (without langw)
    const tempKlusterw = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].hasOwnProperty('klusterw')) {
        tempKlusterw.push(list[i].klusterw);
      }
    }
    // sm
    const result_sm = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].sm) {
        result_sm.push(list[i].sm);
      }
    }

    // smmark
    const result_smmark = [];
    for (let i = 0; i < list.length; i++) {
      if ((list[i].smmark )) {
        result_smmark.push(list[i].smmark);
      }
    }
    // extract all sm and smmark from langw, klusterw, langw-klsuterw
    function push_sm(a) {
      for (let i = 0; i < a.length; i++) {
        if (a[i].sm) {
          result_sm.push(a[i].sm);
        }
      }
    }
    function push_smmark(a) {
      for (let i = 0; i < a.length; i++) {
        if (a[i].smmark) {
          result_smmark.push(a[i].smmark);
        }
      }
    }
    const verben = [];
    verben.push(result_sm, result_smmark);
    push_sm(tempKlusterw);
    push_sm(tempMerkw);
    push_smmark(tempKlusterw);
    push_smmark(tempMerkw);


    // reduce to appropriate form. For sm, smmark and verben
    const result4 = result_sm.reduce((initial, elem) => initial.concat(elem), []);
    const result4_1 = result_smmark.reduce((initial, elem) => initial.concat(elem), []);
    const verben_1 = verben.reduce((initial, elem) => initial.concat(elem), []);
    // apply filters to this words
    const lv_sm = this.myf_LV(result5, result4); // Planet 1, 2, 3, 4 - ub1, 3
    const kv_sm = this.myf_KV(result5, result4); // Planet 1, 3, 4 - ub1, 3
    const kv_smmark = this.myf_KV2(result5, result4_1); // Planet 2, 3, 4 - ub1, 3
    const verben_words = this.fourthP(result5, verben_1);
    // store all data in word array
    this.words.push(lv_sm, kv_sm, kv_smmark, verben_words);
    for (let j = 0; j < this.words.length; j++) {
      this.list2.push(this.words[j].filter((x, i, a) => a.indexOf(x) === i));
    }
    // return data, which will be passed to components - part 1-3
    const getTitle = dom.getElementsByTagName('titel');
    const title = getTitle[0].textContent.replace(/(\r\n|\n|\r)/gm, ' ').replace(/ +/g, ' ').trim();
    switch (part) {
      case 1:
        return [title, this.case1()];
      case 2:
      case 3:
        return [title, this.case3()];
    }

    return;
  }
    // if we have 2 types of data - extract words and silben, apply filter to sort out repeated words and shuffle all words
  case_for_two(a, b) {
        let array1 = [], array2 = [];
        for (let j = 0; j < this.words[a].length; j++) {
          array1.push([this.words[a][j]['__text'], this.words[a][j]['_silb']]);
        }
        for (let j = 0; j < this.words[b].length; j++) {
          if (this.words[b][j] !== undefined) {
            array2.push([this.words[b][j]['__text'], this.words[b][j]['_silb']]);
      }
    }

        array1 = this.filterWords(array1);
        array2 = this.filterWords(array2);
        this.shuffle(array1);
        this.shuffle(array2);

    // Slice amount of words - depending on part
       if (this.partNumber = 'app-part-1') {
           array1 = array1.slice(0, 5);
           array2 = array2.slice(0, 5);
       } else if (this.partNumber = 'app-part-2') {
           array1 = array1.slice(0, 6);
           array2 = array2.slice(0, 6);
       } else if (this.partNumber = 'app-part-3') {
           array1 = array1.slice(0, 10);
           array2 = array2.slice(0, 10);
       }
        array1 = array1.concat(array2);
        return array1;
  }
  // if we have third type of words - extract exact data that we need, filter out  and shuffle and depending on part - slice
   addition(add) {
        let array1 = [];
        for (let j = 0; j < this.words[add].length; j++) {
          array1.push([this.words[add][j]['__text'], this.words[add][j]['_silb']]);
        }
        array1 = this.filterWords(array1);
        this.shuffle(array1);
        if (this.partNumber = 'app-part-1') {
        if (+this.planetNumber === 3) {
          array1 = array1.slice(0, 5);
              } else {
            array1 = array1.slice(0, 3);
          }
        } else  if (this.partNumber = 'app-part-2') {
          array1 = array1.slice(0, 4);
        } else {
          array1 = array1.slice (0, 6);
    }

    return array1;
  }

  // extract data, filter out and shuffle
  case1() {
        if (+this.planetNumber === 1) {
          return this.case_for_two(0, 1);
        } else if (+this.planetNumber === 2) {
          return this.case_for_two(0, 2);
        } else if (+this.planetNumber === 3 ) {
          return this.case_for_two(0, 1).concat(this.addition(2));
        }
  }

  case3() {
      if (+this.planetNumber !== 4) {
        let array1 = [], array2 = [];
        for (let j = 0; j < this.words[0].length; j++) {
          array1.push([this.words[0][j]['__text'], this.words[0][j]['_silb']]);
        }
        for (let j = 0; j < this.words[2].length; j++) {
          if (this.words[2][j] !== undefined) {
            array2.push([this.words[2][j]['__text'], this.words[2][j]['_silb']]);
          }
        }

        array1 = this.filterWords(array1);
        array2 = this.filterWords(array2);
        this.shuffle(array1);
        this.shuffle(array2);
        if (this.partNumber === 'app-part-2') {
          array1 = array1.slice(0, 6);
          array2 = array2.slice(0, 6);
          array1 = array1.concat(array2);

        } else if (this.partNumber === 'app-part-3') {
          array1 = array1.concat(array2);
          this.shuffle(array1);
          array1 = array1.slice(0, 20);

        }

        const arr1 = [], arr2 = [];
        for (let i = 0; i < array1.length; i++) {
          arr1.push(array1[i][0]);
          arr2.push(array1[i][1]);
        }
          return [this.text, arr1, arr2];

      } else {
          let array1 = [];
          // these wordss need to be excluded
          const stark = ['bregen', 'brechen', 'beißen', 'beginnen', 'biegen', 'bieten', 'binden', 'bitten', 'blasen', 'bleiben',
            'dreschen', 'erschrecken', 'essen', 'fallen', 'fechten', 'finden',
            'flechten', 'fliegen', 'fliehen', 'fließen', 'fressen', 'gelten',
            'gehen', 'gelingen', 'genießen', 'geschehen', 'gewinnen', 'gießen', 'graben', 'greifen', 'heben', 'heißen', 'helfen',
            'klingen', 'kneifen', 'kommen', 'lassen', 'laufen', 'leiden', 'leihen', 'lesen', 'liegen', 'messen', 'pfeifen', 'raten',
            'reißen', 'reiten', 'riechen', 'rufen', 'saufen', 'scheinen', 'schieben', 'schlafen', 'schlagen', 'schleichen', 'schließen',
            'schmeißen', 'schmelzen', 'schneiden', 'schreiben', 'schneiden', 'schreien', 'schweigen',
            'schwimmen', 'sehen', 'sitzen', 'sprechen',
            'stehen', 'steigen', 'stoßen', 'streichen', 'tragen', 'treffen', 'treiben', 'verlieren', 'vergessen', 'ziehen', 'haben',
            'sein', 'werden', 'tun', 'dürfen', 'mögen', 'geben', 'treten', 'halten'];
        if (this.partNumber === 'app-part-2') {
          for (let j = 0; j < this.words[3].length; j++) {
            if (stark.indexOf(this.words[3][j]['_lemma']) === -1) {
              array1.push([this.words[3][j]['__text'], this.words[3][j]['_lemma']]);
            }
          }
        } else if (this.partNumber === 'app-part-3') {
          for (let j = 0; j < this.words[3].length; j++) {
            if (stark.indexOf(this.words[3][j]['_lemma']) === -1) {
              array1.push([this.words[3][j]['__text'], this.words[3][j]['_morph']]);
            }
          }
          array1 = this.filterWords(array1);
        }
          this.shuffle(array1);
        //  array1 = this.filterWords(array1);

        const arr1 = [], arr2 = [];
          for (let i = 0; i < array1.length; i++) {
            arr1.push(array1[i][0]);
            arr2.push(array1[i][1]);
          }
          return [this.text, arr1, arr2];
      }
  }

  shuffle(array: any[]): void {
        array.sort(function () {
          return 0.5 - Math.random();
        });
  }

  filterWords(arr: any) {
        const newArray: any = [];

        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];

          if (element[1].split('-').length - 1 === 1) {
            let hasElement = false;
            for (let j = 0; j < newArray.length; j++) {
              if (element[0] === newArray[j][0]) {
                hasElement = true;
              }
            }

            if (!hasElement) {
              newArray.push(element);
            }
          }
        }

        return newArray;
      }
}
