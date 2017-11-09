/*
* Component for 3rd part
* check and modify (if user clicks - modify word - insert "-"
* */
import { Component, EventEmitter, OnInit, Input, Output, ViewChild, OnChanges, SimpleChange } from '@angular/core';
import { InfoComponent } from '../../info/info.component';
import { HTTPService } from '../../service/http.service';
import { SharedService } from '../../service/shared.service';
import { FillInBlankComponentParent } from '../../fillinblankparent.component';


@Component({
  selector: 'app-fill-in-blank2',
  templateUrl: 'fillinblank2.component.html',
  styleUrls: ['../../fillinblankparent.component.css'],
  providers: [InfoComponent, HTTPService]
})

export class FillInBlank2Component extends FillInBlankComponentParent implements OnInit {

  constructor(public info: InfoComponent, public shared: SharedService) {
    super(shared);
  }

  check() {
    const i = this.current[0]; // current column
    const j = this.current[1]; // current row
    const isLast = i === this.newSplitWords.length - 1 && j === this.newSplitWords[this.newSplitWords.length - 1].length - 1;
    const maxLength = this.newSplitWords[this.current[0]].length - 1; // count of input fields in current column
    const initial = this.newSplitWords[i][j].replace(this.SYLLABLE_DELIMITER, this.DELIMITER);
    const correct = this.newSplitWords[i][j].replace(this.SYLLABLE_DELIMITER, this.FULL_DELIMITER);

    this.parentCheck(initial, correct, maxLength, isLast);
  }

  modifyWord(event): void {
    const target = event.target || event.srcElement || event.currentTarget; // element that was clicked on
    const ids = target.attributes.id.value.split('_'); // id consists of 2 parts separated by underscore


    const i = ids[0]; // first part is index of the column
    const j = ids[1]; // second part is index of the row

    const caretPos = target.selectionStart;
    if (caretPos || caretPos === '0') {
      const letter = this.model[i][j].charAt(caretPos);
      if (letter === this.DELIMITER) { // if clicked letter space, replace it with full syllable delimiter
        this.model[i][j] = this.model[i][j].substring(0, caretPos)
            + this.FULL_DELIMITER
            + this.model[i][j].substring(caretPos + 1);
      } else if (letter === this.SYLLABLE_DELIMITER) { // if clicked character is hyphen,
        // replace it and 2 non breaking spaces around it with 1 space
        this.model[i][j] = this.model[i][j].substring(0, caretPos - 1)
            + this.DELIMITER + this.model[i][j].substring(caretPos + 2);
      } else if (letter === this.SPACE) { // if letter is non breaking space
        if (this.model[i][j].charAt(caretPos + 1) === this.SYLLABLE_DELIMITER) { // if it is to the left of
          // the syllable delimiter, replace spaces and syllable delimiter with space
          this.model[i][j] = this.model[i][j].substring(0, caretPos)
            + this.DELIMITER + this.model[i][j].substring(caretPos + 3);
        } else { // if it is to the right of the syllable delimiter, replace spaces and syllable delimiter with space
          this.model[i][j] = this.model[i][j].substring(0, caretPos - 2)
            + this.DELIMITER + this.model[i][j].substring(caretPos + 1);
        }
      }
    }
  }
}
