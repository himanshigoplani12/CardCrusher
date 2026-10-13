import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnComponent } from '../column/column';
import { Board } from '../../models/board.model';
import { Data } from '../../services/data';

@Component({
  imports: [ColumnComponent, CommonModule],
  selector: 'app-board',
  styleUrl: './board.scss',
  templateUrl: './board.html',
})
export class BoardComponent {
  private dataService = inject(Data);
  board$ = this.dataService.board$;

  openAddForm() {
    this.dataService.openAddForm();
  }
}
