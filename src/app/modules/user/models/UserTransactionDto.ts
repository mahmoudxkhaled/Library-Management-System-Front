export interface UserTransactionDto {
  id: string;
  bookId: number;
  bookName: string;
  bookImageUrl: string;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: string;
  isOverdue: boolean;
  daysRemaining: number;
}
