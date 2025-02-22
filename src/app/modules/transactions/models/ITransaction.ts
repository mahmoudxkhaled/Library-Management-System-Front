import { IBook } from "../../books/models/IBook";

export interface ITransaction {
    id: string;
    userId: string;
    bookId: string;
    book?: IBook;
    issueDate: Date;
    dueDate: Date;
    returnDate?: Date;
    status: string; // "Issued", "Returned", "Overdue"
    isActive: boolean;
}