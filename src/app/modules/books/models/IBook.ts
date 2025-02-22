import { ICategory } from "../../categories/models/ICategory";
import { IFeedback } from "../../feedbacks/models/IFeedback";
import { ITransaction } from "../../transactions/models/ITransaction";

export interface IBook {
  id: string;
  title: string;
  author: string;
  imageUrl?: string;
  publicationYear: number;
  availableCopies: number;
  totalCopies: number;
  categoryId: string;
  category?: ICategory;
  transactions: ITransaction[];
  feedbacks: IFeedback[];
  isActive: boolean;
}