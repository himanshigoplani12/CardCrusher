import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card } from '../models/card.model';
import { Column } from '../models/column.model';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class Data {

  private cards: Card[] = [
    {
      id: 11297,
      ticketCode: 'CC-11297',
      title: 'Design login modal',
      description: 'Create a clean login modal with email/password fields',
      status: 'ready-for-dev',
      storyPoints: 3,
      owner: 'Himanshi G.',
      assignee: 'Himanshi G.',
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptanceCriteria: [
        { text: 'Modal opens on button click', isCompleted: false },
        { text: 'Form validates empty fields', isCompleted: false }
      ]
    },
    {
      id: 3882,
      ticketCode: 'CC-3882',
      title: 'Card drag-and-drop',
      description: 'Enable dragging cards between columns',
      status: 'in-dev',
      storyPoints: 5,
      owner: 'Himanshi G.',
      assignee: 'Himanshi G.',
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptanceCriteria: [
        { text: 'Card moves between columns on drag', isCompleted: true },
        { text: 'Status persists after refresh', isCompleted: false }
      ]
    }
  ];

  private columns: Column[] = [
    { id: 1, name: 'Ready for dev', cardIds: [11297] },
    { id: 2, name: 'In dev', cardIds: [3882] },
    { id: 3, name: 'Code review and merge', cardIds: [] },
    { id: 4, name: 'Test in dev', cardIds: [] },
    { id: 5, name: 'Done', cardIds: [] }
  ];

  private board: Board = {
    id: 1,
    name: 'CardCrusher Board',
    columns: this.columns
  };

  private boardSubject = new BehaviorSubject<Board>(this.board);
  board$ = this.boardSubject.asObservable();

  private cardsSubject = new BehaviorSubject<Card[]>(this.cards);
  cards$ = this.cardsSubject.asObservable();

  getCardById(id: number): Card | undefined {
    return this.cards.find(c => c.id === id);
  }

  constructor() { }
}