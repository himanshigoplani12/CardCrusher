import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from './components/board/board';
import { CardModalComponent } from './components/card-modal/card-modal';

@Component({
  imports: [RouterOutlet, BoardComponent, CardModalComponent],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('card-crusher');
}
