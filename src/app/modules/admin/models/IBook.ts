import { ICategory } from "../components/categories/models/ICategory";
import { IFeedback } from "../components/feedbacks/models/IFeedback";
import { ITransaction } from "../components/transactions/models/ITransaction";


export interface IBook {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorId: number
  coverImageUrl?: string;
  publicationYear: number;
  availableCopies: number;
  totalCopies: number;
  categoryId: string;
  category?: ICategory;
  transactions: ITransaction[];
  feedbacks: IFeedback[];
  isActive: boolean;
}