import { IBook } from "../../../models/IBook";

export interface ITransaction {
    id: string;
    userId: string;
    bookId: string;
    book?: IBook;
    issueDate?: Date;
    dueDate: Date;
    returnDate?: Date;
    requestDate?: Date;
    status: string; // "Pending","Issued", "Returned", "Overdue"
    isActive: boolean;
    userFullName:string;
    bookName:string;
}

export interface ITransactionDetails extends ITransaction {
    borrowDays:number;
    issuedByUser:string;
    returnNotes:string;
    returnedByUser:string;
}