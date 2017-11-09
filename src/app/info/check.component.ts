/* Component is responsible for checking the answers from users */
import {Component, Output, EventEmitter, Injectable} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-check-component',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css'],
})

@Injectable()
export class CheckComponent {
  // emit custom events, can be accessed outside the component
  @Output() exerciseSubmitEvent = new EventEmitter();
  public hack = 'assets/hack.png';
  clickSound() {
    this.exerciseSubmitEvent.next();
  }
}
