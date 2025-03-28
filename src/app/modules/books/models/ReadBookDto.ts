export class ReadBookDto {
    id: number;
    title: string;
    author: string;
    categoryId: number;
    publicationYear: number;
    availableCopies: number;
    totalCopies: number;
    imageUrl?: string; 
}  
