/*
* parent component for part 2 and part 3
* display text in right way - 2 colimns, each text on each planet has words, which has their own color
* count tries
* */
import { EventEmitter, OnInit, Input, Output } from '@angular/core';
import { SharedService } from './service/shared.service';

export class FillInBlankComponentParent implements OnInit {

  @Input() fields: string[]; // right words, that must be typed in
  @Input() public textline: string; // the whole text
  @Input() public words: string[]; //
  @Input() public splitWords: string[]; // split right words, relevant to part 3
  @Input() public title: any; // title of text
  @Input() public planetNumber: any; // number of Planet
  @Input() public wordsForInput: any; // split right words, relevant to part 2
  @Output() public scoringCompeteEvent = new EventEmitter();

  public current = [0, 0]; // stores the column and row of the current input/checked word

  public score = 0; // score that the user has earned
  public triesLeft = 2; // tries that user has for 1 word

  public texts: string[][] = []; // 2D array of texts between the input fields

  public newFields: string[][] = []; // 2D array that stores the words that are replaced by <input> in correct order
  public newSplitWords: string[][] = [];
  public newWordsForInput: string[][] = [];

  public SIZE = [0, 1]; // column count stored as an array
  public unsortedFields: string[] = []; // array of words that need to be replaced in the text by <input> in incorrect order
  public colors: string[][] = []; // 2D array that stores color of each word

  public model: string[][] = [];

  public SPACE = '\xa0'; // non breakable space as a delimiter
  public DELIMITER = ' '; // delimiter between word characters
  public SYLLABLE_DELIMITER = '-'; // delimiter of the syllables
  public FULL_DELIMITER = this.SPACE + this.SYLLABLE_DELIMITER + this.SPACE; // full delimiter of the syllables

  public constructor(public shared: SharedService) {}

  ngOnInit() {
    this.shared.insertData(this.title);

    for (let i = 0; i < this.SIZE.length; i++) { // for each column, put empty arrays in model and checked
      this.model.push([]);
    }

    if (this.words !== undefined) { // if there are words, copy them in unsorted fields
      this.unsortedFields = this.words.slice();
      this.words = []; // empty the word array
    } else {
      this.unsortedFields = this.fields.slice();
      this.fields = []; // make array of correct words empty
    }

    let endPosition = 0; // start position of where the text was split into columns
    for (let i = 0; i < this.SIZE.length; i++) { // for every column
      let startPosition = endPosition; // make start position of the column the end position of previous column

      endPosition = Math.floor(this.textline.length / this.SIZE.length) * (i + 1); // make end position one ith of the size of the text
      endPosition = (endPosition <= this.textline.length) ? endPosition : this.textline.length;
      // if calculated end position is greater than the text length, make it text lenght

      if (startPosition !== 0) {
        while (this.textline[startPosition] !== ' ') { // increase start position until it is between the words
          startPosition++;
        }
      }

      while (this.textline[endPosition] !== ' ') { // decrease the end position until it is between the words
        endPosition--;
      }

      const columnText = this.textline.substring(startPosition, endPosition); // text of one column is between startPosition and endPosition

      const data = this.parse(columnText); // parse one column
      // put all parsed data into corresponding arrays where the index is the index of the column
      this.texts.push(data[0]);
      this.newFields.push(data[1]);
      this.newSplitWords.push(data[2]);
      this.colors.push(data[3]);
      this.newWordsForInput.push(data[4]);

      if (data[2] !== undefined) { // if there are words split by syllables
        // add each word that user needs to split in syllables in the <input>
        for (let j = 0; j < data[2].length; j++) {
          this.model[i].push(data[2][j].replace(this.SYLLABLE_DELIMITER, this.DELIMITER));
          // remove the correct solution from the word that is put into <input>
        }
      }
    }
  }

  parse(txt: string) {
    const words: string[] = txt.split(' '); // all words in the text
    let startPosition = -1; // stores start position of the text, until the word that need to be replaced by <input>

    let previousPunctuation = undefined; // stores the punctuation after the word that is replaced by <input>
    const texts = []; // array of texts
    const fields = []; // array of words that are replaced by <input>
    const splitWords = []; // array of words split by syllable
    const colors = []; // array of colors of the words
    const wordsForInput = []; // word that needs to be input as a text
    for (let i = 0; i < words.length; i++) { // iterate over every word
      const word = words[i].replace(/\.|\?|!|;|:|,/, ''); // if word has punctuation after it, remove it
      const regex = new RegExp('(' + word + ')(\\.|\\?|!|;|:|,)?', 'g'); // create regex for punctuation after the word
      let punctuation = '';
      const match = regex.exec(words[i]);
      if (match[2] !== undefined) { // if there is punctuation, save it
        punctuation = match[2];
      }

      const index = this.unsortedFields.indexOf(word);
      if (index > -1) { // if current word is in words that need to be replaced
        this.unsortedFields = this.unsortedFields.slice(0, index).concat(this.unsortedFields.slice(index + 1)); // remove the word from the array, because it was already replaced by <input>
        fields.push(word); // add word that was replaced by <input> to the array (correct order)

        if (this.wordsForInput !== undefined) { // if words that need to input exist
          wordsForInput.push(this.wordsForInput[index]); // add the word that needs to be input
          this.wordsForInput = this.wordsForInput.slice(0, index).concat(this.wordsForInput.slice(index + 1)); // remove that word from unsorted array
        }

        if (this.splitWords !== undefined) { // if there are words that have their syllables split
          // add the word in form in which user will split it (replace "-" with " - "
          splitWords.push(this.splitWords[index].replace('-', this.SYLLABLE_DELIMITER).split('')
            .join(this.DELIMITER).replace(this.DELIMITER + this.SYLLABLE_DELIMITER + this.DELIMITER, this.SYLLABLE_DELIMITER));
          this.splitWords = this.splitWords.slice(0, index).concat(this.splitWords.slice(index + 1)); // remove it from unsorted array
        }

        let text = (previousPunctuation !== undefined) ? previousPunctuation : ''; // if there is punctuation from last part of the text, add it first
        text += ' ' + words.slice(startPosition + 1, i).join(' ') + ' '; // add the text between two <input>
        previousPunctuation = punctuation; // store the punctuation of the word if it exists
        texts.push(text); // add text to array
        startPosition = i; // store the start position of the next text
      }

      colors.push(this.getPlanetColor()); // add the color of current word based on the planet number
    }

    let text = (previousPunctuation !== undefined) ? previousPunctuation : ''; // if there was punctuation after the word, then add it
    text += ' ' + words.splice(startPosition + 1, words.length).join(' '); // add the text between last <input> and the end of text
    texts.push(text); // add text to array
    return [texts, fields, splitWords, colors, wordsForInput];
  }

  parentCheck(initial: string, correct: string, maxLength: number, isLast: boolean) { // performs checks if the user input is correct
    if (this.triesLeft <= 0) { // do not perform checks if there are no tries left
      return;
    }

    let isCorrect = false;
    if (this.model[this.current[0]][this.current[1]] === correct) { // if user input is correct
      this.correct(maxLength);
      isCorrect = true;
    } else {
      this.incorrect(initial, correct);
    }

    this.noTriesLeft(isLast, maxLength, isCorrect); // check if there are no tries left and current word increase is required
  }

  incorrect(initial: string, correct: string): void { // if the word is incorrect
      this.triesLeft--; // decrease the amount of tries user has for this word

      if (this.triesLeft > 0) { // if there are tries left
        this.model[this.current[0]][this.current[1]] = initial; // reset the input to initial input
      } else { // if no tries left,
        this.colors[this.current[0]][this.current[1]] = 'red'; // make word color red
        this.model[this.current[0]][this.current[1]] = correct; // insert correct answer
      }

      // update score
      this.scoringCompeteEvent.next({'score': this.score, 'correct': false});
  }

  correct(maxLength: number): void { // if the word is correct
    // add score depending on the try
    if (this.triesLeft === 2) {
      this.score += 50;
    } else {
      this.score += 25;
    }

    // make color of the word green
    this.colors[this.current[0]][this.current[1]] = 'green';

    // update score
    this.scoringCompeteEvent.next({'score': this.score, 'correct': true});
    this.increaseCurrent(maxLength);
  }

  noTriesLeft(isLast: boolean, maxLength: number, isCorrect): void { // performs actions if there are no more tries left
    if (this.triesLeft <= 0) { // if there are no tries left
      if (isLast) { // if it is the last input, play audio and redirect
        this.scoringCompeteEvent.next({'score': this.score, 'redirect': true});
      } else { // otherwise increase current word
        this.increaseCurrent(maxLength);
      }
    } else if (isLast && isCorrect) { // if there are tries left and it is the last word that is correct, update score and go to next
      this.scoringCompeteEvent.next({'score': this.score, 'correct': true, 'redirect': true});
    }
  }

  increaseCurrent(maxLength: number): void { // increases the current position of the word, maxLength - parameter that takes the count of words in a column
    const j = this.current[1];

    if (j === maxLength) { // if it was the last words in a column, jump to the first word in next column
      this.current[0]++;
      this.current[1] = 0;
    } else { // if it is not last word in the column, go to the next word in the column
      this.current[1]++;
    }

    this.triesLeft = 2; // user has 2 tries of the new word
  }

  getPlanetColor(): string { // returns the color of the word depending on the planet number
    switch (+this.planetNumber) {
      case 1:
        return 'magenta';
      case 2:
        return 'violet';
      case 3:
        return 'darkViolet';
      case 4:
        return 'blue';
    }
  }
}
