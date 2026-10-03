import { Component, inject, Input } from '@angular/core';
import { Column } from '../../models/column.model';
import { CommonModule } from '@angular/common';
import { Data } from '../../services/data';
import { Card } from '../../models/card.model';
import { CardComponent } from '../card/card';

@Component({
  imports: [CommonModule, CardComponent],
  selector: 'app-column',
  styleUrl: './column.scss',
  templateUrl: './column.html',
})
export class ColumnComponent {
  @Input() column!: Column;
  private dataService = inject(Data);
  cards$ = this.dataService.cards$;

  getCardsForColumn(allCards: Card[]): Card[] {
    return allCards.filter(card => this.column.cardIds.includes(card.id));
  }
}
