/*
* check for component 2 - Quapptext
* */
import { Component, OnInit } from '@angular/core';
import { InfoComponent } from '../../info/info.component';
import { HTTPService } from '../../service/http.service';
import { SharedService } from '../../service/shared.service';
import { FillInBlankComponentParent } from '../../fillinblankparent.component';

@Component({
  selector: 'app-fill-in-blank',
  templateUrl: 'fillinblank.component.html',
  styleUrls: ['../../fillinblankparent.component.css'],
  providers: [InfoComponent, HTTPService]
})

export class FillInBlankComponent extends FillInBlankComponentParent implements OnInit {

  constructor(public info: InfoComponent, public shared: SharedService) {
    super(shared);
  }

  check() {
    const i = this.current[0]; // current column
    const j = this.current[1]; // current row
    const maxLength = this.newFields[this.current[0]].length - 1; // count of input fields in current column
    // true if currently checked word is the last in the column
    const isLast = i === this.newFields.length - 1 && j === this.newFields[this.newFields.length - 1].length - 1;
    const initial = ''; // initial value of the input
    const correct = this.newFields[i][j]; // correct answer to the
    this.parentCheck(initial, correct, maxLength, isLast); // perform check in parent
  }
}
