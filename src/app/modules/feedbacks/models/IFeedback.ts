export interface IFeedback {
    id: string;
    userId: string;
    bookId: string;
    rating: number;
    comment: string;
    isActive: boolean;
}