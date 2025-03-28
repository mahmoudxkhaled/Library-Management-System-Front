import { IBook } from "../../../models/IBook";

export interface ICategory {
  id: string;
  name: string;
  booksCount?: number;
  description: string;
  imageUrl?: string;
  books: IBook[];
  isActive: boolean;
}