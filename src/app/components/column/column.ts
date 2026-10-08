import { Component, inject, Input } from '@angular/core';
import { Column } from '../../models/column.model';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { Data } from '../../services/data';
import { Card } from '../../models/card.model';
import { CardComponent } from '../card/card';

@Component({
  imports: [CommonModule, CardComponent, DragDropModule],
  selector: 'app-column',
  styleUrl: './column.scss',
  templateUrl: './column.html',
})
export class ColumnComponent {
  @Input() column!: Column;
  private dataService = inject(Data);
  cards$ = this.dataService.cards$;

  getCardsForColumn(allCards: Card[]): Card[] {
    return this.column.cardIds
      .map((cardId) => allCards.find((card) => card.id === cardId))
      .filter((card): card is Card => card !== undefined);
  }

  getConnectedDropLists(): string[] {
    return this.dataService.getAllColumnIds();
  }

  onCardDrop(event: CdkDragDrop<Card[]>) {
    if(event.previousContainer === event.container) {
      return;
    }

    const cardId = event.item.data.id;
    const fromColumnId = Number(event.previousContainer.id);
    const toColumnId = Number(event.container.id);
    this.dataService.moveCard(cardId, fromColumnId, toColumnId);
  }
}
