export interface UserTransactionDto {
  id: string;
  bookId: number;
  bookName: string;
  bookImageUrl: string;
  requestDate:Date;
  issueDate?: Date;
  dueDate?: Date;
  returnDate?: Date;
  status: string;
  isOverdue: boolean;
  daysRemaining: number;
}
