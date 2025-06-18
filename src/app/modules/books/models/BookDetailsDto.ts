  export class BookDetailsDto{
  // Book Details
  title: string;
  description?: string;
  imageUrl?: string;
  publicationYear: number;
  availableCopies: number;
  totalCopies: number;
  // Author Details
  authorFullName: string;
  authorDescription: string;
  authorDateOfBirth: string;
  authorImageUrl?: string;
  // Category Details
  categoryName: string;
  categoryDescription: string;
  categoryImageUrl?: string;
  isBorrowed:boolean
  }