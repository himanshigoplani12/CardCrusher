export interface Card {
    id: number,
    ticketCode: string,
    storyPoints: number,
    title: string,
    description: string,
    status: string,
    owner: string,
    assignee: string,
    createdAt: Date,
    updatedAt: Date,
    acceptanceCriteria: { text: string, isCompleted: boolean }[],
}
