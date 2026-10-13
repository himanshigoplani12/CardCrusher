import { Injectable } from '@angular/core';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';
import { Card } from '../models/card.model';
import { Column } from '../models/column.model';
import { Board } from '../models/board.model';

export interface CardFormState {
  mode : 'add' | 'edit';
  card?: Card;
}

@Injectable({
  providedIn: 'root',
})

export class Data {
  private cards: Card[] = [
    {
      id: 10234,
      ticketCode: 'CC-10234',
      title: 'Design patient registration form',
      description:
        'Create a multi-step form to register new patients with validation for required medical fields',
      status: 'ready-for-dev',
      storyPoints: 3,
      owner: 'Himanshi Goplani',
      assignee: 'Himanshi Goplani',
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptanceCriteria: [
        { text: 'Form validates required fields', isCompleted: false },
        { text: 'Supports multi-step navigation', isCompleted: false },
      ],
    },
    {
      id: 10567,
      ticketCode: 'CC-10567',
      title: 'Build appointment booking flow',
      description: 'Allow patients to view doctor availability and book a slot',
      status: 'ready-for-dev',
      storyPoints: 5,
      owner: 'Himanshi Goplani',
      assignee: 'Himanshi Goplani',
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptanceCriteria: [
        { text: 'Available slots fetched correctly', isCompleted: false },
        { text: 'Booking confirmation shown to user', isCompleted: false },
      ],
    },
    {
      id: 9821,
      ticketCode: 'CC-9821',
      title: 'Doctor availability calendar',
      description: 'Build a calendar view for doctors to mark their available time slots',
      status: 'in-dev',
      storyPoints: 5,
      owner: 'Himanshi Goplani',
      assignee: 'Himanshi Goplani',
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptanceCriteria: [
        { text: 'Calendar renders correct dates', isCompleted: true },
        { text: 'Doctor can toggle slot availability', isCompleted: false },
      ],
    },
    {
      id: 9456,
      ticketCode: 'CC-9456',
      title: 'Patient dashboard UI',
      description:
        'Dashboard showing upcoming appointments, prescriptions, and reports for a logged-in patient',
      status: 'code-review',
      storyPoints: 8,
      owner: 'Himanshi Goplani',
      assignee: 'Himanshi Goplani',
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptanceCriteria: [
        { text: 'Shows upcoming appointments', isCompleted: true },
        { text: 'Shows prescription history', isCompleted: true },
      ],
    },
    {
      id: 8873,
      ticketCode: 'CC-8873',
      title: 'Login & role-based access',
      description: 'Separate login flows and permissions for patients, doctors, and admins',
      status: 'test-in-dev',
      storyPoints: 5,
      owner: 'Himanshi Goplani',
      assignee: 'Himanshi Goplani',
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptanceCriteria: [
        { text: 'Role-based routing works correctly', isCompleted: true },
        { text: 'Unauthorized users redirected to login', isCompleted: true },
      ],
    },
    {
      id: 8210,
      ticketCode: 'CC-8210',
      title: 'Project setup & folder structure',
      description: 'Initialize Angular project with routing, base layout, and folder conventions',
      status: 'done',
      storyPoints: 2,
      owner: 'Himanshi Goplani',
      assignee: 'Himanshi Goplani',
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptanceCriteria: [
        { text: 'Routing configured', isCompleted: true },
        { text: 'Base layout components created', isCompleted: true },
      ],
    },
    {
      id: 10891,
      ticketCode: 'CC-10891',
      title: 'Prescription upload & history',
      description: 'Let doctors upload prescriptions and patients view their prescription history',
      status: 'test-in-dev',
      storyPoints: 5,
      owner: 'Himanshi Goplani',
      assignee: 'Himanshi Goplani',
      createdAt: new Date(),
      updatedAt: new Date(),
      acceptanceCriteria: [
        { text: 'Doctor can upload prescription PDF/image', isCompleted: true },
        { text: 'Patient can view past prescriptions', isCompleted: true },
      ],
    },
  ];

  private columns: Column[] = [
    { id: 1, name: 'Ready for dev', cardIds: [10234, 10567] },
    { id: 2, name: 'In dev', cardIds: [9821] },
    { id: 3, name: 'Code review and merge', cardIds: [9456] },
    { id: 4, name: 'Test in dev', cardIds: [8873, 10891] },
    { id: 5, name: 'Done', cardIds: [8210] },
  ];

  private board: Board = {
    id: 1,
    name: 'CardCrusher Board',
    columns: this.columns,
  };

  private boardSubject = new BehaviorSubject<Board>(this.board);
  board$ = this.boardSubject.asObservable();

  private cardsSubject = new BehaviorSubject<Card[]>(this.cards);
  cards$ = this.cardsSubject.asObservable();

  private selectedCardSubject = new BehaviorSubject<Card | null>(null);
  selectedCard$ = this.selectedCardSubject.asObservable();

  private formStateSubject = new BehaviorSubject<CardFormState | null>(null);
  formState$ = this.formStateSubject.asObservable();

  private readonly storageKey = 'card-crusher-data';

  getCardById(id: number): Card | undefined {
    return this.cards.find((c) => c.id === id);
  }

  selectCard(id: number) {
    return this.selectedCardSubject.next(this.getCardById(id) || null);
  }

  closeCardModal() {
    this.selectedCardSubject.next(null);
  }

  getAllColumnIds(): string[] {
    return this.columns.map((column) => column.id.toString());
  }

  private commit() {
    this.boardSubject.next(this.board);
    this.cardsSubject.next(this.cards);
    this.saveToStorage();
  }
  
  moveCard(cardId: number, fromColumnId: number, toColumnId: number, toIndex: number) {
    const fromColumn = this.columns.find((col) => col.id === fromColumnId);
    const toColumn = this.columns.find((col) => col.id === toColumnId);

    if (!fromColumn || !toColumn) {
      console.error('Invalid column IDs provided for moving card.');
      return;
    }

    fromColumn.cardIds = fromColumn.cardIds.filter((id) => id !== cardId);
    // toColumn.cardIds.push(cardId);
    // toColumn.cardIds = [...toColumn.cardIds, cardId];
    toColumn.cardIds = [
      ...toColumn.cardIds.slice(0, toIndex),
      cardId,
      ...toColumn.cardIds.slice(toIndex),
    ];

    const card = this.cards.find((c) => c.id === cardId);
    if (card) {
      card.status = this.getStatusFromColumnName(toColumn.name);
      card.updatedAt = new Date();
    }

    this.commit();
  }

  getStatusFromColumnName(columnName: string): string {
    return columnName.toLowerCase().replace(/\s+/g, '-');
  }

  reorderCardsInColumn(columnId: number, fromIndex: number, toIndex: number) {
    const column = this.columns.find((col) => col.id === columnId);
    if (!column) {
      console.error('Invalid column ID provided for reordering cards.');
      return;
    }

    const ids = [...column.cardIds];
    moveItemInArray(ids, fromIndex, toIndex);
    column.cardIds = ids;

    this.commit();
  }

  private saveToStorage() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify({ cards: this.cards, columns: this.columns })
    );
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if(!raw) return;

      const saved = JSON.parse(raw);
      this.cards = saved.cards.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt),
      }));
      this.columns = saved.columns;
      this.board = { ...this.board, columns: this.columns };

      this.boardSubject.next(this.board);
      this.cardsSubject.next(this.cards);
    }
    catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  openAddForm() {
    this.formStateSubject.next({ mode: 'add' });
  }

  openEditForm(cardId: number) {
    const card = this.getCardById(cardId);
    if (card) {
      this.formStateSubject.next({ mode: 'edit', card });
    }
  }

  closeForm() {
    this.formStateSubject.next(null);
  }

  getColumnOptions() {
    return this.columns.map((col) => ({ id: col.id, name: col.name }));
  }

  private generateId(): number {
    let id: number;
    do {
      id = Math.floor(1000 + Math.random() * 99000);
    } while (this.cards.some((card) => card.id === id));
    return id;
  }

  addCard(
    data: { title: string; description: string; storyPoints: number; criteria: string[] },
    columnId: number
  ){
    const column = this.columns.find((col) => col.id === columnId);
    if (!column) {
      console.error('Invalid column ID provided for adding card.');
      return;
    }

    const id = this.generateId();
    const now = new Date();

    const card: Card = {
      id,
      ticketCode: `CC-${id}`,
      title: data.title,
      description: data.description,
      status: this.getStatusFromColumnName(column.name),
      storyPoints: data.storyPoints,
      owner: 'Himanshi Goplani',
      assignee: 'Himanshi Goplani',
      createdAt: now,
      updatedAt: now,
      acceptanceCriteria: data.criteria.map((text) => ({ text, isCompleted: false })),
    };

    this.cards = [...this.cards, card];
    column.cardIds = [...column.cardIds, id];
    this.commit();
  }

  updateCard(
    id: number,
    changes: { title: string; description: string; storyPoints: number },
    criteriaTexts: string[]
  ){
    this.cards = this.cards.map((card) => {
      if (card.id !== id) return card;

      return {
        ...card,
        ...changes,
        acceptanceCriteria: criteriaTexts.map((text) => ({ 
          text, 
          isCompleted: card.acceptanceCriteria.find((c) => c.text === text)?.isCompleted ?? false
        })),
        updatedAt: new Date(),
      };
    });
    this.commit();
  }
  
  deleteCard(cardId: number) {
    this.cards = this.cards.filter((card) => card.id !== cardId);
    this.columns.forEach((column) => {
      column.cardIds = column.cardIds.filter((id) => id !== cardId);
    });
    this.selectedCardSubject.next(null);
    this.commit();
  }

  constructor() {
    this.loadFromStorage();
  }
}
